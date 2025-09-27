---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: /boe.jpg
  overlay_filter: 0.5
---

{% comment %}
Selected publications: explicit curation + order.
We match by exact title (case-insensitive) where you specified, and by venue for JMP.
Links prefer 'link', then 'url' (relative), then 'doi', then 'pdf'.
We also show authors, falling back across common front-matter keys.
The Selected block is widened (full-bleed) without affecting sections below.
{% endcomment %}

{% assign all_items = site.publications | concat: site.wps %}

{% assign printed = "" %} {# guard so an item added earlier won't repeat later in Selected #}

{% capture selected_list %}
<ul class="selected-list">

  {%- comment -%} 1) JOB MARKET PAPER (by venue) {%- endcomment -%}
  {% for post in all_items %}
    {% if post.venue == "Job Market Paper" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}{% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        {% assign href = post.link | default: "" %}
        {% if href == "" and post.url %}{% assign href = post.url | relative_url %}{% endif %}
        {% if href == "" and post.doi %}{% assign href = "https://doi.org/" | append: post.doi %}{% endif %}
        {% if href == "" and post.pdf %}{% assign href = post.pdf %}{% endif %}
        {% assign auth = post.authors | default: post.author | default: post.coauthors %}
        <li class="one-line-pub">
          {% if auth %}<span class="pub-authors">{{ auth }}</span><span class="sep"> · </span>{% endif %}
          {% if href != "" %}<a href="{{ href }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}<span class="pub-title">“{{ post.title }}”</span>{% endif %}
          {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- assign t1 = "free discontinuity regression" -%}
  {%- assign t2 = "metric-space conditional means" -%}
  {%- assign t3 = "return to office and the tenure distribution" -%}
  {%- assign t4 = "refugee return and conflict: evidence from a natural experiment" -%}
  {%- assign t5 = "science skepticism reduces compliance with covid-19 shelter-in-place policies" -%}
  {%- assign t6 = "unmasking partisanship: polarization undermines public response to collective risk" -%}
  {%- assign t7 = "public response to government alerts saves lives during russian invasion of ukraine" -%}

  {%- comment -%} helper to render by matching title (case-insensitive) {%- endcomment -%}
  {% macro render_by_title target %}
    {% for post in all_items %}
      {% assign t_lc = post.title | default: "" | downcase %}
      {% if t_lc == target %}
        {% unless printed contains post.title %}
          {% assign yr = post.year %}{% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
          {% assign href = post.link | default: "" %}
          {% if href == "" and post.url %}{% assign href = post.url | relative_url %}{% endif %}
          {% if href == "" and post.doi %}{% assign href = "https://doi.org/" | append: post.doi %}{% endif %}
          {% if href == "" and post.pdf %}{% assign href = post.pdf %}{% endif %}
          {% assign auth = post.authors | default: post.author | default: post.coauthors %}
          <li class="one-line-pub">
            {% if auth %}<span class="pub-authors">{{ auth }}</span><span class="sep"> · </span>{% endif %}
            {% if href != "" %}<a href="{{ href }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
            {% else %}<span class="pub-title">“{{ post.title }}”</span>{% endif %}
            {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
            <em class="pub-venue">{{ post.venue }}</em>
          </li>
          {% assign printed = printed | append: "||" | append: post.title %}
        {% endunless %}
      {% endif %}
    {% endfor %}
  {% endmacro %}

  {%- comment -%} 2) FDR {%- endcomment -%}
  {% call render_by_title t1 %}{% endcall %}

  {%- comment -%} 3) MSCM {%- endcomment -%}
  {% call render_by_title t2 %}{% endcall %}

  {%- comment -%} 4) R&R: Return to Office… {%- endcomment -%}
  {% call render_by_title t3 %}{% endcall %}

  {%- comment -%} 5) R&R: Refugee Return… {%- endcomment -%}
  {% call render_by_title t4 %}{% endcall %}

  {%- comment -%} 6–8) Specific policy publications {%- endcomment -%}
  {% call render_by_title t5 %}{% endcall %}
  {% call render_by_title t6 %}{% endcall %}
  {% call render_by_title t7 %}{% endcall %}

</ul>
{% endcapture %}

{% assign selected_html = selected_list | strip %}

{% if selected_html != "<ul class=\"selected-list\"></ul>" %}
# Selected publications
<div class="selected-wide">
  {{ selected_html }}
</div>
<hr/>
{% endif %}

# Econometrics 

{% assign econ_pubs = site.publications | where: "field", "Econometrics" %}
{% if econ_pubs.size > 0 %}
## Publications
{% for post in econ_pubs reversed %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

{% assign econ_wps = site.wps | where: "field", "Econometrics" %}
{% if econ_wps.size > 0 %}
## Working Papers
{% for post in econ_wps reversed %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

# Policy

{% assign policy_pubs = site.publications | where: "field", "Policy" %}
{% if policy_pubs.size > 0 %}
## Publications
{% for post in policy_pubs reversed %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

{% assign policy_wps = site.wps | where: "field", "Policy" %}
{% if policy_wps.size > 0 %}
## Working Papers
{% for post in policy_wps reversed %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

<style>
/* one-line selected list */
.selected-list { list-style: none; padding-left: 0; margin-left: 0; }
.one-line-pub { margin: .35rem 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pub-authors { font-weight: 500; }
.pub-title { text-decoration: none; border-bottom: 1px solid rgba(0,0,0,.15); }
.pub-title:hover { border-bottom-color: rgba(0,0,0,.35); }
.pub-year { color: #666; }
.pub-venue { font-style: italic; color: #444; }
.sep { color: #aaa; }

/* make ONLY the Selected block full-bleed */
.selected-wide {
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
