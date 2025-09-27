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
Selected publications: one-line entries only.
Priority: 1) Job Market Paper, 2) all R&Rs (venue contains 'Revise and Resubmit'),
3) pubs in Journal of Public Economics + Proceedings of the National Academy of Sciences.
{%- endcomment -%}
{% assign all_items = site.publications | concat: site.wps %}

{% assign jmp = all_items | where: "venue", "Job Market Paper" %}
{% assign rr_all = all_items | where_exp:"p","p.venue and p.venue downcase contains 'revise and resubmit'" %}
{% assign top_pubs_jpube = all_items | where_exp:"p","p.venue and p.venue downcase contains 'journal of public economics'" %}
{% assign top_pubs_pnas  = all_items | where_exp:"p","p.venue and p.venue downcase contains 'proceedings of the national academy of sciences'" %}
{% assign selected_raw = jmp | concat: rr_all | concat: top_pubs_jpube | concat: top_pubs_pnas %}

{%- comment -%} Deduplicate by title (preserve priority order) {%- endcomment -%}
{% assign seen_titles = "" | split:"" %}
{% assign selected = "" | split:"" %}
{% for p in selected_raw %}
  {% unless seen_titles contains p.title %}
    {% assign selected = selected | push:p %}
    {% assign seen_titles = seen_titles | push:p.title %}
  {% endunless %}
{% endfor %}

{% if selected.size > 0 %}
## Selected publications
<ul class="selected-list">
  {% for post in selected %}
    {% assign yr = post.year %}
    {% if yr == nil or yr == "" %}
      {% if post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
    {% endif %}
    <li class="one-line-pub">
      <span class="pub-authors">{{ post.authors }}</span>
      ·
      {% if post.url %}
        <a href="{{ post.url | relative_url }}" class="pub-title">“{{ post.title }}”</a>
      {% else %}
        <span class="pub-title">“{{ post.title }}”</span>
      {% endif %}
      {% if yr %} ({{ yr }}){% endif %}.
      <em class="pub-venue">{{ post.venue }}</em>
    </li>
  {% endfor %}
</ul>
<hr/>
{% endif %}

{%- comment -%} Hide selected items from sections below? Set to false to show again. {%- endcomment -%}
{% assign hide_selected = true %}
{% assign selected_titles = selected | map: "title" %}

# Econometrics

{% assign econ_pubs = site.publications | where: "field", "Econometrics" %}
{% assign econ_wps  = site.wps          | where: "field", "Econometrics" %}

{% if econ_pubs.size > 0 %}
## Publications
{% for post in econ_pubs reversed %}
  {% if hide_selected and selected_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

{% if econ_wps.size > 0 %}
## Working Papers
{% for post in econ_wps reversed %}
  {% if hide_selected and selected_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

# Policy

{% assign policy_pubs = site.publications | where: "field", "Policy" %}
{% assign policy_wps  = site.wps          | where: "field", "Policy" %}

{% if policy_pubs.size > 0 %}
## Publications
{% for post in policy_pubs reversed %}
  {% if hide_selected and selected_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

{% if policy_wps.size > 0 %}
## Working Papers
{% for post in policy_wps reversed %}
  {% if hide_selected and selected_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

<style>
.selected-list { list-style: none; padding-left: 0; margin-left: 0; }
.one-line-pub { margin: .35rem 0; }
.pub-authors { font-weight: 500; }
.pub-title { text-decoration: none; }
.pub-venue { font-style: italic; }
</style>
