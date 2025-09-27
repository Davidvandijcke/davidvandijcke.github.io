---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: /boe.jpg
  overlay_filter: 0.5
---

> My primary field is **Econometrics**. Below I highlight my Job Market Paper and top R&Rs/publications, followed by field-organized lists.

{%- comment -%} Build master list {%- endcomment -%}
{% assign all_items = site.publications | concat: site.wps %}

{%- comment -%} Featured priority:
   1) Job Market Paper
   2) All R&Rs (venue contains 'Revise and Resubmit')
   3) PNAS + JPubE pubs
{%- endcomment -%}
{% assign jmp = all_items | where: "venue", "Job Market Paper" %}
{% assign rr_all = all_items | where_exp:"p","p.venue and p.venue downcase contains 'revise and resubmit'" %}
{% assign top_pubs_jpube = all_items | where_exp:"p","p.venue and p.venue downcase contains 'journal of public economics'" %}
{% assign top_pubs_pnas  = all_items | where_exp:"p","p.venue and p.venue downcase contains 'proceedings of the national academy of sciences'" %}
{% assign top_pubs = top_pubs_jpube | concat: top_pubs_pnas %}

{% assign featured_raw = jmp | concat: rr_all | concat: top_pubs %}

{%- comment -%} Deduplicate by title while preserving order {%- endcomment -%}
{% assign seen = "" | split: "" %}
{% assign featured = "" | split: "" %}
{% for p in featured_raw %}
  {% unless seen contains p.title %}
    {% assign featured = featured | push: p %}
    {% assign seen = seen | push: p.title %}
  {% endunless %}
{% endfor %}

{% if featured.size > 0 %}
## Featured papers
<ul class="clean-list">
  {% for post in featured %}
    <li>{% include publication-entry.html post=post %}</li>
  {% endfor %}
</ul>
<hr/>
{% endif %}

{% assign hide_featured = true %}
{% assign featured_titles = featured | map: "title" %}

# Econometrics 

{% assign econ_pubs = site.publications | where: "field", "Econometrics" %}
{% assign econ_wps  = site.wps          | where: "field", "Econometrics" %}

{% if econ_pubs.size > 0 %}
## Publications
{% for post in econ_pubs reversed %}
  {% if hide_featured and featured_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

{% if econ_wps.size > 0 %}
## Working Papers
{% for post in econ_wps reversed %}
  {% if hide_featured and featured_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

# Policy

{% assign policy_pubs = site.publications | where: "field", "Policy" %}
{% assign policy_wps  = site.wps          | where: "field", "Policy" %}

{% if policy_pubs.size > 0 %}
## Publications
{% for post in policy_pubs reversed %}
  {% if hide_featured and featured_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

{% if policy_wps.size > 0 %}
## Working Papers
{% for post in policy_wps reversed %}
  {% if hide_featured and featured_titles contains post.title %}{% continue %}{% endif %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

<style>
.clean-list { list-style: none; padding-left: 0; margin-left: 0; }
.clean-list li { margin: .6rem 0; }
</style>
