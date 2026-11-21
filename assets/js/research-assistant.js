/* Research assistant widget for www.davidvandijcke.com.
   Talks to the Hugging Face Space set in _config.yml (research_assistant_api):
   POST {api}/api/chat streams server-sent events (meta, status, delta, done,
   error). The model can place [[paper:id]], [[video:id]], [[thread:id#n]] and
   [[link:id]] tags in its answer; they render as cards built only from the
   site's own registry (/assets/data/research.json), never from model-written
   URLs. Cards reuse the research-media overlays (window.DVDResearch). The
   conversation is kept in sessionStorage so it survives navigation. */
(function () {
  'use strict';

  var root = document.getElementById('dva-root');
  if (!root || window.__dvaLoaded) return;
  window.__dvaLoaded = true;

  var API = (root.getAttribute('data-api') || '').replace(/\/+$/, '');
  var MODEL_LABEL = root.getAttribute('data-model') || 'Claude';
  var STORE = 'dva:v1';
  var WARM_KEY = 'dva:warm';
  var MAX_HISTORY = 12;
  var MAX_INPUT = 2000;

  var ALLOWED_HOSTS = /^(www\.)?(davidvandijcke\.com|davidvandijcke\.github\.io|alphaxiv\.org|arxiv\.org|github\.com|x\.com|doi\.org|nature\.com|pnas\.org|sciencedirect\.com|aeaweb\.org|cepr\.org|bfi\.uchicago\.edu|scholar\.google\.com|calendar\.app\.google|coarse\.ink|ssrn\.com|papers\.ssrn\.com|openicpsr\.org)$/i;

  var ICON = {
    spark: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.2c.4 3.9 3.9 7.4 7.8 7.8-3.9.4-7.4 3.9-7.8 7.8-.4-3.9-3.9-7.4-7.8-7.8 3.9-.4 7.4-3.9 7.8-7.8z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>',
    reset: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.8 8a5.2 5.2 0 1 0 1.6-3.8M2.6 2.4v2.9h2.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    up: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M3.8 7.5L8 3.3l4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.5" y="4.5" width="7" height="7" rx="1.2" fill="currentColor"/></svg>',
    arrow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.8 4.3L12.5 8l-3.7 3.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    ext: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h6.5V10M12.5 3.5L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L12.6 8z" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.3 6.9L14.6 1h-1.3L8.8 6.1 5.2 1H1l5.5 7.8L1 15h1.3l4.8-5.4 3.8 5.4H15L9.3 6.9zm-1.7 1.9l-.6-.8L2.8 2h1.9l3.6 5.1.6.8 4.6 6.6h-1.9L7.6 8.8z" fill="currentColor"/></svg>'
  };

  var SUGGESTIONS = [
    ['Inference after coding agents', 'Give me the short version of "Inference After Coding Agents", and show me the animation.'],
    ['R3D for a non-econometrician', 'Explain R3D, regression discontinuity with distribution-valued outcomes, to someone who is not an econometrician.'],
    ['The internet shutdown estimate', 'How did free discontinuity regression estimate the economic effect of the internet shutdown in Rajasthan?'],
    ['Papers that come with code', 'Which of David\'s papers come with code or software packages?'],
    ['Meeting David', 'How can I book a meeting with David?']
  ];

  /* ---------------- State ---------------- */
  var state = { messages: [], open: false, busy: false, ctrl: null, gen: 0 };
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    if (saved && Array.isArray(saved.messages)) {
      state.messages = saved.messages.filter(function (m) {
        return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content;
      });
      state.open = !!saved.open;
    }
  } catch (err) { /* private mode or bad JSON: start fresh */ }

  function save() {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({
        open: state.open,
        messages: state.messages.filter(function (m) { return !m.pending && m.content; })
          .map(function (m) { return { role: m.role, content: m.content }; })
      }));
    } catch (err) { /* ignore */ }
  }

  /* ---------------- Registry ---------------- */
  var registryPromise = null;
  var R = null;
  function loadRegistry() {
    if (!registryPromise) {
      registryPromise = (window.DVDResearch ? window.DVDResearch.load() :
        fetch('/assets/data/research.json').then(function (r) { return r.json(); }))
        .then(function (d) { R = d; return d; })
        .catch(function (err) { registryPromise = null; throw err; });
    }
    return registryPromise;
  }
  function paperById(id) {
    var list = (R && R.registry && R.registry.papers) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* ---------------- Helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function isSmall() {
    return window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  }
  function safeHref(u) {
    u = String(u || '').trim();
    if (/^\/(?!\/)/.test(u)) return u;
    var m = /^https?:\/\/([^/?#]+)/i.exec(u);
    return m && ALLOWED_HOSTS.test(m[1]) ? u : null;
  }
  function isExternal(u) { return /^https?:\/\//i.test(u) && !/^https?:\/\/(www\.)?davidvandijcke\.com/i.test(u); }

  /* ---------------- Markdown (escaped first, small subset) ---------------- */
  function emph(h) {
    return h.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[^\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  }
  function inlineText(s) {
    var re = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
    var out = '';
    var last = 0;
    var m;
    while ((m = re.exec(s))) {
      out += emph(esc(s.slice(last, m.index)));
      var href = safeHref(m[2]);
      out += href ? '<a href="' + esc(href) + '"' + (isExternal(href) ? ' target="_blank" rel="noopener"' : '') + '>' +
        emph(esc(m[1])) + '</a>' : emph(esc(m[1]));
      last = re.lastIndex;
    }
    return out + emph(esc(s.slice(last)));
  }
  function inline(s) {
    return s.split(/(`[^`\n]+`)/).map(function (part, i) {
      return i % 2 ? '<code>' + esc(part.slice(1, -1)) + '</code>' : inlineText(part);
    }).join('');
  }
  function md(src) {
    var html = '';
    var para = [];
    var list = null;
    function flushPara() {
      if (para.length) html += '<p>' + inline(para.join('\n')).replace(/\n/g, '<br>') + '</p>';
      para = [];
    }
    function flushList() {
      if (list) {
        html += '<' + list.type + '>' + list.items.map(function (it) { return '<li>' + inline(it) + '</li>'; }).join('') + '</' + list.type + '>';
      }
      list = null;
    }
    String(src).replace(/\r/g, '').split('\n').forEach(function (line) {
      var t = line.trim();
      if (!t) { flushPara(); flushList(); return; }
      var h = /^#{1,6}\s+(.*)$/.exec(t);
      var ul = /^[-*•]\s+(.*)$/.exec(t);
      var ol = /^\d+[.)]\s+(.*)$/.exec(t);
      if (h) { flushPara(); flushList(); html += '<p class="dva-h">' + inline(h[1]) + '</p>'; return; }
      if (ul || ol) {
        flushPara();
        var type = ul ? 'ul' : 'ol';
        if (!list || list.type !== type) { flushList(); list = { type: type, items: [] }; }
        list.items.push((ul || ol)[1]);
        return;
      }
      if (list && /^\s{2,}\S/.test(line)) { list.items[list.items.length - 1] += ' ' + t; return; }
      flushList();
      para.push(t);
    });
    flushPara();
    flushList();
    return html;
  }

  /* ---------------- Answer segments: text and cards ---------------- */
  var DIR_RE = /\[\[(paper|video|thread|link):([\w-]+)(?:#(\d+))?\]\]/g;

  function segmentize(text, final) {
    var src = final ? text : text.replace(/\[\[[^\]\n]*\]?$/, '');
    var segs = [];
    var buf = [];
    var cards = 0;
    function flush() {
      var t = buf.join('\n');
      if (t.trim()) segs.push({ type: 'text', text: t });
      buf = [];
    }
    src.split('\n').forEach(function (line) {
      var found = [];
      var rest = line.replace(DIR_RE, function (all, kind, id, post) {
        found.push({ kind: kind, id: id, post: post ? parseInt(post, 10) : 0 });
        return '';
      });
      if (!found.length) { buf.push(line); return; }
      if (rest.trim()) buf.push(rest);
      flush();
      found.forEach(function (f) {
        if (cards >= 4) return;
        cards += 1;
        segs.push({ type: 'card', kind: f.kind, id: f.id, post: f.post, key: f.kind + ':' + f.id + (f.post ? '#' + f.post : '') });
      });
    });
    flush();
    return segs;
  }

  /* A chip that opens a research-media overlay; its href is the plain
     fallback (X thread, alphaXiv page, video file) for modifier-clicks. */
  function rmHref(kind, id) {
    var reg = R && R.registry;
    var u = '';
    if (kind === 'thread' && R && R.threads && R.threads[id]) u = R.threads[id].url;
    if (kind === 'video' && reg && reg.videos && reg.videos[id]) u = reg.videos[id].light;
    if (kind === 'alphaxiv') { var p = paperById(id); u = p && p.alphaxiv; }
    return safeHref(u) || '#';
  }
  function chipRm(kind, id, label, icon, post, solid) {
    return '<a class="dva-chip' + (solid ? ' dva-chip--solid' : '') + '" href="' + esc(rmHref(kind, id)) + '" data-rm="' + kind + '" data-rm-id="' + esc(id) + '"' +
      (post ? ' data-rm-post="' + post + '"' : '') + '>' + (icon || '') + esc(label) + '</a>';
  }
  function chipLink(href, label, solid) {
    var safe = safeHref(href);
    if (!safe) return '';
    var ext = isExternal(safe);
    return '<a class="dva-chip' + (solid ? ' dva-chip--solid' : '') + '" href="' + esc(safe) + '"' +
      (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(label) + (ext ? ICON.ext : '') + '</a>';
  }
  function plain(text) {
    return String(text || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/\s+/g, ' ').trim();
  }

  function buildCard(seg) {
    var reg = R && R.registry;
    if (!reg) return null;
    var card;
    if (seg.kind === 'paper') {
      var p = paperById(seg.id);
      if (!p) return null;
      var status = String(p.status || '').split(';')[0];
      var who = p.authors && p.authors !== 'solo' ? 'David Van Dijcke ' + p.authors : 'David Van Dijcke';
      var acts = [];
      if (p.pdf) acts.push(chipLink(p.pdf, 'PDF', true));
      else if (p.arxiv) acts.push(chipLink(p.arxiv, 'arXiv', true));
      else if (p.journal) acts.push(chipLink(p.journal, 'Journal', true));
      if (p.alphaxiv) acts.push(chipRm('alphaxiv', p.id, 'alphaXiv'));
      if (p.thread && R.threads && R.threads[p.thread]) acts.push(chipRm('thread', p.thread, 'Thread', ICON.x));
      if (p.video && reg.videos && reg.videos[p.video]) acts.push(chipRm('video', p.video, 'Animation', ICON.play));
      if (p.code) acts.push(chipLink(p.code, 'Code'));
      acts.push('<a class="dva-chip" href="/research/#paper-' + esc(p.id) + '" data-dva-goto="' + esc(p.id) + '">On the research page</a>');
      card = el('div', 'dva-card dva-card--paper',
        '<div class="dva-card__pad"><div class="dva-card__eyebrow">' + esc(status + (p.year ? ' · ' + p.year : '')) + '</div>' +
        '<div class="dva-card__title">' + esc(p.title) + '</div><div class="dva-card__meta">' + esc(who) + '</div>' +
        '<div class="dva-card__actions">' + acts.join('') + '</div></div>');
    } else if (seg.kind === 'video') {
      var v = reg.videos && reg.videos[seg.id];
      if (!v) return null;
      card = el('div', 'dva-card dva-card--video',
        '<video muted loop playsinline preload="metadata" poster="' + esc(safeHref(v.light_poster) || '') + '" src="' + esc(safeHref(v.light) || '') + '"></video>' +
        '<div class="dva-card__pad"><div><div class="dva-card__eyebrow">Animation, simulated values</div><div class="dva-card__title">' + esc(v.title) + '</div></div>' +
        chipRm('video', seg.id, 'Full screen', '', 0, true) + '</div>');
      var vid = card.querySelector('video');
      if (!reduceMotion()) {
        var pr = vid.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
    } else if (seg.kind === 'thread') {
      var th = R.threads && R.threads[seg.id];
      if (!th) return null;
      var n = th.posts.length;
      var idx = seg.post && seg.post <= n ? seg.post - 1 : 0;
      var post = th.posts[idx];
      var img = (post.media && post.media[0]) || '';
      if (!img && !seg.post) {
        for (var i = 0; i < n && !img; i++) img = (th.posts[i].media && th.posts[i].media[0]) || '';
      }
      var tp = paperById(th.paper);
      card = el('div', 'dva-card dva-card--thread',
        '<div class="dva-card__pad"><div class="dva-thread' + (img ? '' : ' no-thumb') + '"><div>' +
        '<div class="dva-thread__who">' + ICON.x + 'David on X · ' + (seg.post ? 'post ' + (idx + 1) + ' of ' + n : n + ' posts') + '</div>' +
        '<div class="dva-thread__text">' + esc(plain(post.text)) + '</div></div>' +
        (img && safeHref(img) ? '<img class="dva-thread__thumb" src="' + esc(img) + '" alt="" loading="lazy">' : '') + '</div>' +
        '<div class="dva-card__actions">' + chipRm('thread', seg.id, 'Read the thread', '', seg.post || 0, true) +
        chipLink(th.url, 'View on X') + (tp && tp.alphaxiv ? chipRm('alphaxiv', tp.id, 'alphaXiv') : '') + '</div></div>');
      var thumb = card.querySelector('img');
      if (thumb) thumb.addEventListener('error', function () { thumb.remove(); card.querySelector('.dva-thread').classList.add('no-thumb'); });
    } else if (seg.kind === 'link') {
      var l = reg.links && reg.links[seg.id];
      var href = l && safeHref(l.url);
      if (!href) return null;
      var ext = isExternal(href);
      var where = ext ? href.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : 'davidvandijcke.com' + href;
      card = el('a', 'dva-linkcard', esc(l.label) + ' <span>' + esc(where) + '</span>' + (ext ? ICON.ext : ICON.arrow));
      card.href = href;
      card.setAttribute('data-dva-link', seg.id);
      if (ext) { card.target = '_blank'; card.rel = 'noopener'; }
    }
    if (card) card.setAttribute('data-key', seg.key);
    return card;
  }

  /* Render an assistant answer into its container, touching only segments
     that changed, so cards (and their videos) are created once. */
  function renderAnswer(box, text, final) {
    /* Remember the latest text, so a deferred re-render (registry arriving
       late) uses the current answer rather than the one it was scheduled with. */
    box._dvaText = text;
    box._dvaFinal = final;
    var segs = segmentize(text, final);
    var kids = box.children;
    var i;
    function put(node, cur) {
      if (cur) box.replaceChild(node, cur);
      else box.appendChild(node);
    }
    for (i = 0; i < segs.length; i++) {
      var seg = segs[i];
      var cur = kids[i];
      if (seg.type === 'text') {
        if (!cur || cur.getAttribute('data-key') !== 'text') {
          var t = el('div', 'dva-text');
          t.setAttribute('data-key', 'text');
          put(t, cur);
          cur = t;
        }
        if (cur.getAttribute('data-src') !== seg.text) {
          cur.innerHTML = md(seg.text);
          cur.setAttribute('data-src', seg.text);
        }
      } else if (!cur || cur.getAttribute('data-key') !== seg.key) {
        var c = buildCard(seg);
        if (!c) {
          /* Registry not loaded yet, or an id the registry does not know:
             keep an invisible slot and retry once the registry arrives. */
          c = el('div', '');
          c.setAttribute('data-key', 'pending:' + seg.key);
          c.hidden = true;
          if (!R) loadRegistry().then(function () { if (box.isConnected) renderAnswer(box, box._dvaText, box._dvaFinal); }).catch(function () {});
        }
        put(c, cur);
      }
    }
    while (kids.length > segs.length) box.removeChild(kids[kids.length - 1]);
    var caret = box.querySelector('.dva-caret');
    if (caret) caret.remove();
    if (!final) {
      var last = box.lastElementChild;
      var host = last && last.classList.contains('dva-text') ? (last.lastElementChild || last) : null;
      /* After a list, the caret goes at the end of its last item rather than
         on a line of its own below the list. */
      while (host && /^(UL|OL)$/.test(host.tagName) && host.lastElementChild) host = host.lastElementChild;
      if (host) host.appendChild(phased(el('span', 'dva-caret'), 1000));
    }
  }

  /* The caret and the status dots are rebuilt as the answer streams in. Each
     new copy starts at the phase its animation would have reached, so the blink
     and the bounce stay steady instead of restarting on every redraw. */
  function phased(node, period) {
    node.style.setProperty('--dva-phase', -(Date.now() % period) + 'ms');
    return node;
  }

  /* ---------------- DOM ---------------- */
  var launcher = el('button', 'dva-launch', ICON.spark + '<span>Ask about my research</span>');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'dva-panel');

  var panel = el('section', 'dva-panel',
    '<header class="dva-head"><span class="dva-mark">' + ICON.spark + '</span>' +
    '<div class="dva-head__text"><strong id="dva-title">Research assistant</strong><span>' + esc(MODEL_LABEL) + ' · from David\'s papers</span></div>' +
    '<button type="button" class="dva-icon" data-dva="reset" title="New conversation" aria-label="New conversation">' + ICON.reset + '</button>' +
    '<button type="button" class="dva-icon" data-dva="close" title="Close" aria-label="Close the assistant">' + ICON.close + '</button></header>' +
    '<div class="dva-body" aria-live="polite"><div class="dva-log"></div></div>' +
    '<form class="dva-form" autocomplete="off"><label class="dva-sr" for="dva-input" style="position:absolute;left:-9999px">Your question</label>' +
    '<textarea id="dva-input" class="dva-input" rows="1" maxlength="' + MAX_INPUT + '" placeholder="Ask about a paper, a method or the data"></textarea>' +
    '<button type="submit" class="dva-send" aria-label="Send">' + ICON.up + '</button></form>' +
    '<div class="dva-foot">AI-generated answers can be wrong. The papers are the authority.</div>');
  panel.id = 'dva-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'dva-title');

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var body = panel.querySelector('.dva-body');
  var log = panel.querySelector('.dva-log');
  var form = panel.querySelector('.dva-form');
  var input = panel.querySelector('.dva-input');
  var sendBtn = panel.querySelector('.dva-send');

  function nearBottom() { return body.scrollHeight - body.scrollTop - body.clientHeight < 80; }
  function toBottom() { body.scrollTop = body.scrollHeight; }

  function renderIntro() {
    var box = el('div', 'dva-intro',
      '<p class="dva-intro__lead">Ask about David\'s research.</p>' +
      '<p class="dva-intro__sub">Answers draw on his papers, his CV and the threads he wrote about them. The assistant can open papers, threads and the coding-agents animation on this site.</p>' +
      '<div class="dva-suggest"></div>');
    var list = box.querySelector('.dva-suggest');
    SUGGESTIONS.forEach(function (s) {
      var b = el('button', '', '<span>' + esc(s[0]) + '</span>' + ICON.arrow);
      b.type = 'button';
      b.addEventListener('click', function () { send(s[1]); });
      list.appendChild(b);
    });
    return box;
  }

  function renderMessage(m) {
    var wrap = el('div', 'dva-msg dva-msg--' + m.role);
    if (m.role === 'user') {
      wrap.appendChild(el('div', 'dva-bubble')).textContent = m.content;
    } else {
      var box = el('div', 'dva-answer');
      wrap.appendChild(box);
      renderAnswer(box, m.content, true);
    }
    m.node = wrap;
    return wrap;
  }

  function renderAll() {
    log.innerHTML = '';
    if (!state.messages.length) {
      log.appendChild(renderIntro());
      return;
    }
    state.messages.forEach(function (m) { log.appendChild(renderMessage(m)); });
  }

  function setBusy(b) {
    state.busy = b;
    body.setAttribute('aria-busy', b ? 'true' : 'false');
    sendBtn.innerHTML = b ? ICON.stop : ICON.up;
    sendBtn.setAttribute('aria-label', b ? 'Stop the answer' : 'Send');
    sendBtn.type = b ? 'button' : 'submit';
    updateSend();
  }
  function updateSend() { sendBtn.disabled = !state.busy && !input.value.trim(); }

  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight + 2, 140) + 'px';
    updateSend();
  }

  /* ---------------- Open / close ---------------- */
  function openPanel(opts) {
    opts = opts || {};
    panel.hidden = false;
    void panel.offsetWidth;
    panel.classList.add('is-open');
    launcher.classList.add('is-hidden');
    launcher.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('dva-open');
    state.open = true;
    save();
    /* Cards fill themselves in when the registry arrives (see renderAnswer);
       redrawing every message here would detach an answer that is streaming. */
    loadRegistry().then(function () { toBottom(); }).catch(function () {});
    warm();
    toBottom();
    if (!opts.silent && !isSmall()) input.focus({ preventScroll: true });
  }
  function closePanel(opts) {
    panel.classList.remove('is-open');
    launcher.classList.remove('is-hidden');
    launcher.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('dva-open');
    state.open = false;
    save();
    setTimeout(function () { if (!state.open) panel.hidden = true; }, 230);
    if (!(opts && opts.noFocus)) launcher.focus({ preventScroll: true });
  }

  /* ---------------- Network ---------------- */
  var warming = null;
  function warm(force) {
    if (!API) return Promise.resolve(false);
    var last = 0;
    try { last = parseInt(sessionStorage.getItem(WARM_KEY) || '0', 10); } catch (err) { /* ignore */ }
    if (!force && Date.now() - last < 4 * 60 * 1000) return Promise.resolve(true);
    if (warming) return warming;
    warming = fetch(API + '/health', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('health ' + r.status);
        try { sessionStorage.setItem(WARM_KEY, String(Date.now())); } catch (err) { /* ignore */ }
        return true;
      })
      .catch(function () { return false; })
      .then(function (ok) { warming = null; return ok; });
    return warming;
  }

  /* Poll /health until the Space answers, the deadline passes, or the
     visitor stops or resets (alive() turns false). */
  function waitForWake(deadline, alive) {
    if (!alive()) return Promise.resolve(false);
    return warm(true).then(function (ok) {
      if (ok) return true;
      if (!alive() || Date.now() > deadline) return false;
      return new Promise(function (res) { setTimeout(res, 5000); }).then(function () { return waitForWake(deadline, alive); });
    });
  }

  function statusHtml(label) {
    return '<span class="dva-status"><span class="dva-status__dots" style="--dva-phase:' + -(Date.now() % 1200) + 'ms"><i></i><i></i><i></i></span><span>' + label + '</span></span>';
  }

  function send(text) {
    text = String(text || '').trim().slice(0, MAX_INPUT);
    if (!text || state.busy) return;
    if (!state.open) openPanel({ silent: true });
    if (!state.messages.length) log.innerHTML = '';
    var u = { role: 'user', content: text };
    state.messages.push(u);
    log.appendChild(renderMessage(u));
    input.value = '';
    autosize();
    save();
    ask(0);
  }

  function ask(attempt) {
    var gen = state.gen;
    var m = { role: 'assistant', content: '', pending: true };
    state.messages.push(m);
    var wrap = el('div', 'dva-msg dva-msg--assistant');
    var box = el('div', 'dva-answer');
    var status = el('div', '', statusHtml('Reading the papers'));
    wrap.appendChild(status);
    wrap.appendChild(box);
    log.appendChild(wrap);
    m.node = wrap;
    toBottom();
    setBusy(true);
    loadRegistry().catch(function () {});

    var history = state.messages.filter(function (x) { return !x.pending && x.content; })
      .slice(-MAX_HISTORY).map(function (x) { return { role: x.role, content: x.content }; });
    var ctrl = window.AbortController ? new AbortController() : null;
    state.ctrl = ctrl;
    var scheduled = false;
    var gotText = false;

    function paint(final) {
      var stick = nearBottom();
      renderAnswer(box, m.content, final);
      if (stick) toBottom();
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () { scheduled = false; if (m.pending) paint(false); });
    }
    /* gen changes when the visitor starts a new conversation; m.cancelled is
       set by Stop while the Space is waking up. */
    function alive() { return gen === state.gen && !m.cancelled; }
    function drop() {
      var i = state.messages.indexOf(m);
      if (i >= 0) state.messages.splice(i, 1);
    }
    function finish() {
      if (gen !== state.gen) return;
      m.pending = false;
      if (status.isConnected) status.remove();
      paint(true);
      setBusy(false);
      state.ctrl = null;
      if (!m.content) { drop(); wrap.remove(); }
      save();
    }
    function fail(msg, retryable) {
      if (gen !== state.gen) return;
      m.pending = false;
      drop();
      if (!wrap.isConnected) log.appendChild(wrap);
      status.innerHTML = '';
      var err = el('div', 'dva-error', esc(msg));
      if (retryable) {
        var b = el('button', '', 'Try again');
        b.type = 'button';
        b.addEventListener('click', function () { wrap.remove(); ask(0); });
        err.appendChild(b);
      }
      status.appendChild(err);
      setBusy(false);
      state.ctrl = null;
      save();
    }
    function wake() {
      if (!alive()) return;
      status.innerHTML = statusHtml('Waking the assistant up. After a quiet spell this takes up to a minute');
      /* Stop while waking: drop the pending answer at once; the poll then
         sees alive() === false and ends quietly. */
      state.ctrl = {
        abort: function () {
          m.cancelled = true;
          drop();
          wrap.remove();
          if (gen === state.gen) { setBusy(false); state.ctrl = null; save(); }
        }
      };
      waitForWake(Date.now() + 90000, alive).then(function (ok) {
        if (gen !== state.gen || m.cancelled) return;
        if (ok) {
          drop();
          wrap.remove();
          setBusy(false);
          ask(attempt + 1);
        } else {
          fail('The assistant is not responding right now. Please try again in a few minutes.', true);
        }
      });
    }

    fetch(API + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, page: { path: location.pathname, title: document.title } }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (j) {
          if ((res.status === 502 || res.status === 503 || res.status === 504) && !j.error && attempt < 2) return wake();
          fail(j.error || 'The assistant is unavailable right now.', res.status !== 429 && res.status !== 403);
        });
      }
      if (!res.body || !res.body.getReader) {
        return res.text().then(function (t) { consume(t); finish(); });
      }
      var reader = res.body.getReader();
      var dec = new TextDecoder();
      var buf = '';
      var ended = false;
      function consume(chunk) {
        buf += chunk;
        var cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) {
          var frame = buf.slice(0, cut);
          buf = buf.slice(cut + 2);
          frame.split('\n').forEach(function (line) {
            if (line.indexOf('data:') !== 0) return;
            var ev;
            try { ev = JSON.parse(line.slice(5)); } catch (err) { return; }
            if (ev.type === 'meta' && ev.papers && ev.papers.length && !gotText) {
              var names = ev.papers.map(function (id) { var p = paperById(id); return p ? p.short : id; });
              status.innerHTML = statusHtml('Reading <em>' + esc(names.join('</em> and <em>')) + '</em>');
            } else if (ev.type === 'status' && ev.state === 'thinking' && !gotText) {
              status.innerHTML = statusHtml('Thinking');
            } else if (ev.type === 'delta') {
              if (!gotText) { gotText = true; status.remove(); }
              m.content += ev.text;
              schedule();
            } else if (ev.type === 'done') {
              ended = true;
            } else if (ev.type === 'error') {
              ended = true;
              m.error = ev.message || 'The assistant could not answer just now.';
            }
          });
        }
      }
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) {
            if (m.error && !m.content) return fail(m.error, true);
            return finish();
          }
          consume(dec.decode(r.value, { stream: true }));
          if (ended && m.error && !m.content) { try { reader.cancel(); } catch (err) { /* ignore */ } return fail(m.error, true); }
          return pump();
        });
      }
      return pump();
    }).catch(function (err) {
      if (err && err.name === 'AbortError') {
        if (m.content) { m.content += '\n\n*(Stopped.)*'; }
        return finish();
      }
      if (attempt < 2) return wake();
      fail('The assistant could not be reached. Check your connection and try again.', true);
    });
  }

  /* ---------------- Events ---------------- */
  launcher.addEventListener('click', function () { openPanel(); });
  launcher.addEventListener('mouseenter', function () { warm(); });
  launcher.addEventListener('focus', function () { warm(); });

  panel.addEventListener('click', function (e) {
    var t = e.target.closest('[data-dva]');
    if (!t) return;
    var what = t.getAttribute('data-dva');
    if (what === 'close') closePanel();
    if (what === 'reset') {
      state.gen += 1;
      if (state.ctrl) state.ctrl.abort();
      state.ctrl = null;
      setBusy(false);
      state.messages = [];
      save();
      renderAll();
      input.focus({ preventScroll: true });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    send(input.value);
  });
  sendBtn.addEventListener('click', function (e) {
    if (state.busy) {
      e.preventDefault();
      if (state.ctrl) state.ctrl.abort();
    }
  });
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      if (!state.busy) send(input.value);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !state.open) return;
    if (document.querySelector('.rm-overlay:not([hidden])')) return;
    closePanel();
  });

  /* "On the research page": scroll in place when already there. */
  document.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('[data-dva-goto]');
    if (g) {
      var id = 'paper-' + g.getAttribute('data-dva-goto');
      /* On a phone the sheet covers the page, so close it (and keep it
         closed after navigating) before showing the entry. */
      if (isSmall()) closePanel({ noFocus: true });
      if (document.getElementById(id) && /^\/research\/?$/.test(location.pathname)) {
        e.preventDefault();
        if (location.hash === '#' + id) window.dispatchEvent(new HashChangeEvent('hashchange'));
        else location.hash = id;
      }
      return;
    }
    var l = e.target.closest && e.target.closest('[data-dva-link]');
    if (l && !l.target && isSmall()) closePanel({ noFocus: true });
  });

  /* ---------------- Start ---------------- */
  renderAll();
  updateSend();
  var wantOpen = /[?&]ask=1\b/.test(location.search) || location.hash === '#ask';
  if (state.open || wantOpen) openPanel({ silent: !wantOpen });
  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 1500); };
  idle(function () { warm(); loadRegistry().catch(function () {}); });
})();
