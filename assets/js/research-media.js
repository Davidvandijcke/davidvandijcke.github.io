/* Research media: one overlay for X threads, the lens video and embedded
   alphaXiv pages, plus the homepage highlights reel. Elements opt in with
   data-rm="thread|video|alphaxiv" and data-rm-id (and data-rm-post for a
   thread). Every such element is a real link, so the page works without JS
   and modifier-clicks still open a new tab. The research assistant calls the
   same functions through window.DVDResearch. */
(function () {
  'use strict';

  var DATA_URL = '/assets/data/research.json';
  var AVATAR = '/images/headshot.jpg';
  var dataPromise = null;

  var ICON = {
    close: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>',
    ext: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h6.5V10M12.5 3.5L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L12.6 8z" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.3 6.9L14.6 1h-1.3L8.8 6.1 5.2 1H1l5.5 7.8L1 15h1.3l4.8-5.4 3.8 5.4H15L9.3 6.9zm-1.7 1.9l-.6-.8L2.8 2h1.9l3.6 5.1.6.8 4.6 6.6h-1.9L7.6 8.8z" fill="currentColor"/></svg>',
    chevL: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    chevR: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
  };

  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(DATA_URL, { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) throw new Error('research.json ' + r.status);
          return r.json();
        })
        .catch(function (err) {
          dataPromise = null;
          throw err;
        });
    }
    return dataPromise;
  }

  function paperById(data, id) {
    var papers = (data && data.registry && data.registry.papers) || [];
    for (var i = 0; i < papers.length; i++) {
      if (papers[i].id === id) return papers[i];
    }
    return null;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function safeUrl(u) {
    u = String(u || '');
    return /^(https?:\/\/|\/)/.test(u) ? u : '#';
  }

  /* Thread text: escape, then add [label](url) links, **bold**, *italic*,
     @handles and #hashtags. Paragraphs split on blank lines. */
  function decorate(h) {
    h = h.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    h = h.replace(/(^|[\s(])@([A-Za-z0-9_]{1,15})/g, '$1<a href="https://x.com/$2" target="_blank" rel="noopener">@$2</a>');
    h = h.replace(/(^|[\s(])#([A-Za-z][A-Za-z0-9_]*)/g, '$1<a href="https://x.com/hashtag/$2" target="_blank" rel="noopener">#$2</a>');
    return h;
  }

  function inline(s) {
    var re = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
    var out = '';
    var last = 0;
    var m;
    while ((m = re.exec(s))) {
      out += decorate(esc(s.slice(last, m.index)));
      out += '<a href="' + esc(m[2]) + '" target="_blank" rel="noopener">' + esc(m[1]) + '</a>';
      last = re.lastIndex;
    }
    return out + decorate(esc(s.slice(last)));
  }

  function renderPostText(text) {
    return String(text || '').split(/\n{2,}/).map(function (p) {
      return '<p>' + inline(p).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  /* ---------------- Overlay ---------------- */
  var overlay = null;
  var panel = null;
  var lastFocus = null;
  var closeTimer = null;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'rm-overlay';
    overlay.hidden = true;
    overlay.innerHTML = '<div class="rm-overlay__backdrop" data-rm-close></div>' +
      '<div class="rm-overlay__panel" role="dialog" aria-modal="true" tabindex="-1"></div>';
    document.body.appendChild(overlay);
    panel = overlay.querySelector('.rm-overlay__panel');

    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab') {
        trapFocus(e);
      }
    });
    panel.addEventListener('error', function (e) {
      var t = e.target;
      if (t && t.tagName === 'IMG') {
        var box = t.closest('a') || t;
        box.classList.add('is-broken');
      }
    }, true);
  }

  function trapFocus(e) {
    var f = panel.querySelectorAll('a[href], button:not([disabled]), video[controls], iframe, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openPanel(kind, html, label) {
    ensureOverlay();
    clearTimeout(closeTimer);
    if (overlay.hidden) lastFocus = document.activeElement;
    stopMedia();
    panel.className = 'rm-overlay__panel rm-' + kind;
    panel.setAttribute('aria-label', label || '');
    panel.innerHTML = html;
    overlay.classList.remove('is-open');
    overlay.hidden = false;
    document.documentElement.classList.add('rm-lock');
    void panel.offsetWidth;
    overlay.classList.add('is-open');
    var btn = panel.querySelector('[data-rm-close]');
    (btn || panel).focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('rm:open', { detail: { kind: kind } }));
  }

  function stopMedia() {
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll('video'), function (v) {
      try { v.pause(); } catch (err) { /* ignore */ }
    });
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    stopMedia();
    overlay.classList.remove('is-open');
    closeTimer = setTimeout(function () {
      overlay.hidden = true;
      panel.innerHTML = '';
      document.documentElement.classList.remove('rm-lock');
      if (lastFocus && document.contains(lastFocus)) {
        try { lastFocus.focus({ preventScroll: true }); } catch (err) { /* ignore */ }
      }
    }, 260);
  }

  function closeButton(extraClass) {
    return '<button type="button" class="rm-x ' + (extraClass || '') + '" data-rm-close aria-label="Close">' + ICON.close + '</button>';
  }

  function paperHref(p) {
    return safeUrl(p.pdf || p.arxiv || p.journal || p.alphaxiv || '/research/');
  }

  /* ---------------- Thread drawer ---------------- */
  function openThread(id, post) {
    return loadData().then(function (data) {
      var th = data.threads && data.threads[id];
      if (!th) throw new Error('unknown thread ' + id);
      var paper = paperById(data, th.paper) || { short: 'Thread', title: 'Thread' };
      var videos = (data.registry && data.registry.videos) || {};
      var n = th.posts.length;

      var items = th.posts.map(function (p, i) {
        var media = '';
        var v = p.video && videos[p.video];
        if (v) {
          media = '<div class="rm-post__media"><video src="' + esc(safeUrl(v.light)) + '" poster="' + esc(safeUrl(v.light_poster)) +
            '" muted loop playsinline controls preload="metadata"></video></div>';
        } else if (p.media && p.media.length) {
          media = '<div class="rm-post__media' + (p.media.length === 2 ? ' is-pair' : '') + '">' +
            p.media.map(function (u) {
              return '<a href="' + esc(safeUrl(u)) + '" target="_blank" rel="noopener"><img src="' + esc(safeUrl(u)) +
                '" alt="Figure attached to post ' + (i + 1) + '" loading="lazy" decoding="async"></a>';
            }).join('') + '</div>';
        }
        return '<li class="rm-post" id="rm-post-' + (i + 1) + '"><span class="rm-post__num">' + (i + 1) + '/' + n + '</span>' +
          '<div class="rm-post__text">' + renderPostText(p.text) + '</div>' + media + '</li>';
      }).join('');

      var foot = '<div class="rm-drawer__foot">' +
        '<a class="rm-btn rm-btn--primary" href="' + esc(safeUrl(th.url)) + '" target="_blank" rel="noopener">' + ICON.x + 'View on X</a>' +
        (paper.alphaxiv ? '<a class="rm-btn" href="' + esc(safeUrl(paper.alphaxiv)) + '" data-rm="alphaxiv" data-rm-id="' + esc(paper.id) + '">Open on alphaXiv</a>' : '') +
        '<a class="rm-btn" href="' + esc(paperHref(paper)) + '" target="_blank" rel="noopener">Read the paper</a>' +
        '<div class="rm-drawer__source">From the thread on X, with its links restored. Images served by alphaXiv.</div></div>';

      var html = '<div class="rm-drawer__head"><img class="rm-avatar" src="' + AVATAR + '" alt="">' +
        '<div class="rm-drawer__who"><strong>David Van Dijcke</strong><span>@packlesshepherd on X</span></div>' +
        closeButton() + '</div>' +
        '<div class="rm-drawer__paper"><span class="rm-eyebrow-plain">Thread, ' + n + ' posts</span><h3>' + esc(paper.title) + '</h3></div>' +
        '<div class="rm-drawer__scroll"><ol class="rm-thread">' + items + '</ol></div>' + foot;

      openPanel('drawer', html, 'Thread on ' + paper.short);

      var target = post > 1 ? panel.querySelector('#rm-post-' + post) : null;
      if (target) {
        var scroller = panel.querySelector('.rm-drawer__scroll');
        requestAnimationFrame(function () {
          var delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
          scroller.scrollTop = Math.max(0, scroller.scrollTop + delta - 8);
        });
        target.classList.add('is-target');
        setTimeout(function () { target.classList.remove('is-target'); }, 2600);
      }
      var vid = panel.querySelector('.rm-post__media video');
      if (vid && !reduceMotion()) {
        var pr = vid.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
    });
  }

  /* ---------------- Video theater ---------------- */
  function openVideo(id) {
    return loadData().then(function (data) {
      var v = data.registry.videos && data.registry.videos[id];
      if (!v) throw new Error('unknown video ' + id);
      var paper = paperById(data, v.paper) || {};
      var actions = '<div class="rm-actions">' +
        (paper.id ? '<a class="rm-btn" href="' + esc(paperHref(paper)) + '" target="_blank" rel="noopener">Read the paper</a>' : '') +
        (paper.thread ? '<a class="rm-btn" href="#" data-rm="thread" data-rm-id="' + esc(paper.thread) + '">' + ICON.x + 'Thread</a>' : '') +
        (paper.alphaxiv ? '<a class="rm-btn" href="' + esc(safeUrl(paper.alphaxiv)) + '" data-rm="alphaxiv" data-rm-id="' + esc(paper.id) + '">alphaXiv</a>' : '') +
        '</div>';
      var html = closeButton() +
        '<video src="' + esc(safeUrl(v.dark)) + '" poster="' + esc(safeUrl(v.dark_poster)) + '" controls autoplay muted playsinline preload="auto"></video>' +
        '<div class="rm-theater__meta"><div class="rm-theater__text"><strong>' + esc(v.title) + '</strong><p>' + esc(v.caption) + '</p></div>' +
        actions + '</div>';
      openPanel('theater', html, v.title);
    });
  }

  /* ---------------- alphaXiv frame ---------------- */
  function openAlphaxiv(id, fallbackUrl) {
    return loadData().then(function (data) {
      var paper = paperById(data, id);
      var url = paper && paper.alphaxiv ? paper.alphaxiv :
        (id === 'profile' ? data.registry.profiles.alphaxiv : fallbackUrl);
      if (!url || !/^https:\/\/www\.alphaxiv\.org\//.test(url)) throw new Error('no alphaXiv page for ' + id);
      var title = paper ? paper.short : 'David Van Dijcke';
      var html = '<div class="rm-frame__head"><span class="rm-frame__title"><b>alphaXiv</b> &middot; ' + esc(title) + '</span>' +
        '<a class="rm-btn" href="' + esc(url) + '" target="_blank" rel="noopener">Open in new tab' + ICON.ext + '</a>' +
        closeButton() + '</div>' +
        '<div class="rm-frame__body"><div class="rm-frame__status"><div class="rm-spinner"></div><div>Loading alphaXiv</div></div>' +
        '<iframe title="alphaXiv: ' + esc(title) + '" src="' + esc(url) + '" referrerpolicy="strict-origin-when-cross-origin" allow="clipboard-write; fullscreen"></iframe></div>';
      openPanel('frame', html, 'alphaXiv: ' + title);

      var body = panel.querySelector('.rm-frame__body');
      var frame = body.querySelector('iframe');
      frame.addEventListener('load', function () { body.classList.add('is-loaded'); });
      setTimeout(function () {
        if (!body.isConnected || body.classList.contains('is-loaded')) return;
        body.querySelector('.rm-frame__status').innerHTML = '<div>alphaXiv is taking a while to respond.</div>' +
          '<div><a class="rm-btn" href="' + esc(url) + '" target="_blank" rel="noopener">Open it in a new tab' + ICON.ext + '</a></div>';
      }, 12000);
    });
  }

  /* ---------------- Inline video autoplay ---------------- */
  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initAutoplay() {
    var vids = document.querySelectorAll('video[data-rm-autoplay]');
    if (!vids.length || reduceMotion()) return;
    function play(v) {
      if (v.preload === 'none') v.preload = 'auto';
      v.muted = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(vids, play);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) play(en.target);
        else en.target.pause();
      });
    }, { threshold: 0.35 });
    Array.prototype.forEach.call(vids, function (v) { io.observe(v); });
  }

  /* Videos below the fold carry their poster in data-rm-poster and get it only
     when they come near the viewport, so the poster does not compete with the
     page banner on slow connections. */
  function initLazyPosters() {
    var vids = document.querySelectorAll('video[data-rm-poster]');
    if (!vids.length) return;
    function show(v) { if (!v.getAttribute('poster')) v.setAttribute('poster', v.getAttribute('data-rm-poster')); }
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(vids, show);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '300px 0px' });
    Array.prototype.forEach.call(vids, function (v) { io.observe(v); });
  }

  /* ---------------- Highlights reel ---------------- */
  function initReel(reel) {
    var track = reel.querySelector('.rm-reel__track');
    var prev = reel.querySelector('.rm-reel__arrow[data-dir="-1"]');
    var next = reel.querySelector('.rm-reel__arrow[data-dir="1"]');
    if (!track) return;

    function step() {
      var card = track.querySelector('.rm-card');
      return card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    }
    function update() {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    function go(dir) {
      track.scrollBy({ left: dir * step(), behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    Array.prototype.forEach.call(reel.querySelectorAll('.rm-card__media img'), function (img) {
      img.addEventListener('error', function () {
        if (/^data:/.test(img.src)) return;
        img.closest('.rm-card__media').classList.add('is-broken');
      });
    });
  }

  /* ---------------- Research-page anchors ---------------- */
  function flashHash() {
    var h = window.location.hash;
    if (!/^#paper-[\w-]+$/.test(h)) return;
    var el = document.getElementById(h.slice(1));
    if (!el) return;
    setTimeout(function () {
      el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
      el.classList.remove('rm-flash');
      void el.offsetWidth;
      el.classList.add('rm-flash');
    }, 300);
  }

  /* ---------------- Wiring ---------------- */
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var el = e.target.closest('[data-rm]');
    if (el) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var kind = el.getAttribute('data-rm');
      var id = el.getAttribute('data-rm-id');
      var post = parseInt(el.getAttribute('data-rm-post') || '1', 10) || 1;
      var href = el.getAttribute('href');
      var job = kind === 'thread' ? openThread(id, post) :
        kind === 'video' ? openVideo(id) :
        kind === 'alphaxiv' ? openAlphaxiv(id, href) : null;
      if (!job) return;
      e.preventDefault();
      job.catch(function () {
        if (href && href !== '#') window.location.href = href;
      });
      return;
    }
    if (overlay && !overlay.hidden && e.target.closest('[data-rm-close]')) {
      e.preventDefault();
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && !overlay.hidden) close();
  });

  function init() {
    initLazyPosters();
    initAutoplay();
    Array.prototype.forEach.call(document.querySelectorAll('[data-rm-reel]'), initReel);
    flashHash();
    window.addEventListener('hashchange', flashHash);
  }

  window.DVDResearch = {
    load: loadData,
    paper: function (id) { return loadData().then(function (d) { return paperById(d, id); }); },
    openThread: openThread,
    openVideo: openVideo,
    openAlphaxiv: openAlphaxiv,
    close: close
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
