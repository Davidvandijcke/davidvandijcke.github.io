---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: /boe.jpg
  overlay_filter: 0.5
---

{%- comment -%}
Selected publications (one-line). Priority:
1) Job Market Paper
2) Free Discontinuity Regression
3) Metric-Space Conditional Means
4) all R&Rs (any field)
5) all Econometrics publications

We do case-insensitive checks by assigning downcased helpers,
which is safe in GitHub Pages (no filters inside where_exp).
{%- endcomment -%}

{% assign all_items = site.publications | concat: site.wps %}
{% assign econ_pubs = site.publications | where: "field", "Econometrics" %}

{% assign printed = "" %}

{% capture selected_list %}
<ul class="selected-list">

  {%- comment -%} 1) Job Market Paper (exact venue) {%- endcomment -%}
  {% for post in all_items %}
    {% assign v = post.venue | default: "" %}
    {% if v == "Job Market Paper" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          {% if post.authors %}<span class="pub-authors">{{ post.authors }}</span><span class="sep"> · </span>{% endif %}
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 2) Free Discontinuity Regression (case-insensitive title contains) {%- endcomment -%}
  {% for post in all_items %}
    {% assign t_lc = post.title | default: "" | downcase %}
    {% if t_lc contains "free discontinuity" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          {% if post.authors %}<span class="pub-authors">{{ post.authors }}</span><span class="sep"> · </span>{% endif %}
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 3) Metric-Space Conditional Means (case-insensitive title contains) {%- endcomment -%}
  {% for post in all_items %}
    {% assign t_lc = post.title | default: "" | downcase %}
    {% if t_lc contains "metric-space conditional means" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          {% if post.authors %}<span class="pub-authors">{{ post.authors }}</span><span class="sep"> · </span>{% endif %}
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 4) All R&Rs (case-insensitive venue contains both 'revise' and 'resubmit') {%- endcomment -%}
  {% for post in all_items %}
    {% assign v_lc = post.venue | default: "" | downcase %}
    {% if v_lc contains "revise" and v_lc contains "resubmit" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          {% if post.authors %}<span class="pub-authors">{{ post.authors }}</span><span class="sep"> · </span>{% endif %}
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 5) All published Econometrics papers {%- endcomment -%}
  {% for post in econ_pubs %}
    {% unless printed contains post.title %}
      {% assign yr = post.year %}
      {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
      <li class="one-line-pub">
        {% if post.authors %}<span class="pub-authors">{{ post.authors }}</span><span class="sep"> · </span>{% endif %}
        {% if post.link %}
          <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
        {% else %}
          <span class="pub-title">“{{ post.title }}”</span>
        {% endif %}
        {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}.
        <em class="pub-venue">{{ post.venue }}</em>
      </li>
      {% assign printed = printed | append: "||" | append: post.title %}
    {% endunless %}
  {% endfor %}
</ul>
{% endcapture %}

{% assign selected_html = selected_list | strip %}

{% if selected_html != "<ul class=\"selected-list\"></ul>" %}
## Selected publications
{{ selected_html }}
<hr/>
{% endif %}

# Econometrics 

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
.selected-list { list-style: none; padding-left: 0; margin-left: 0; }
.one-line-pub { margin: .4rem 0 .45rem 0; line-height: 1.35; }
.pub-authors { font-weight: 500; }
.pub-title { text-decoration: none; border-bottom: 1px solid rgba(0,0,0,.15); }
.pub-title:hover { border-bottom-color: rgba(0,0,0,.35); }
.pub-year { color: #666; }
.pub-venue { font-style: italic; color: #444; }
.sep { color: #aaa; }
</style>
