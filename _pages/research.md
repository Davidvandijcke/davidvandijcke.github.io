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
4) all items whose venue contains "Revise and Resubmit"
5) all Econometrics publications (econ_pubs)

Safe-mode friendly:
- No 'where_exp', 'group_by', 'push', or 'continue'
- Use simple if/contains and a 'printed' guard to avoid duplicates within Selected
{%- endcomment -%}

{% assign all_items = site.publications | concat: site.wps %}
{% assign econ_pubs = site.publications | where: "field", "Econometrics" %}

{% assign printed = "" %}

{% capture selected_list %}
  <ul class="selected-list">
  {%- comment -%} 1) Job Market Paper {%- endcomment -%}
  {% for post in all_items %}
    {% if post.venue == "Job Market Paper" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          <span class="pub-authors">{{ post.authors }}</span>
          ·
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} ({{ yr }}){% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 2) Free Discontinuity Regression (match by title substring; adjust if your casing differs) {%- endcomment -%}
  {% for post in all_items %}
    {% if post.title and post.title contains "Free Discontinuity" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          <span class="pub-authors">{{ post.authors }}</span>
          ·
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} ({{ yr }}){% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 3) Metric-Space Conditional Means (match by title substring; adjust casing if needed) {%- endcomment -%}
  {% for post in all_items %}
    {% if post.title and post.title contains "metric-space conditional means" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          <span class="pub-authors">{{ post.authors }}</span>
          ·
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} ({{ yr }}){% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 4) All R&Rs (venue contains substring) {%- endcomment -%}
  {% for post in all_items %}
    {% if post.venue and post.venue contains "Revise and Resubmit" %}
      {% unless printed contains post.title %}
        {% assign yr = post.year %}
        {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
        <li class="one-line-pub">
          <span class="pub-authors">{{ post.authors }}</span>
          ·
          {% if post.link %}
            <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
          {% else %}
            <span class="pub-title">“{{ post.title }}”</span>
          {% endif %}
          {% if yr %} ({{ yr }}){% endif %}.
          <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} 5) All published Econometrics papers (econ_pubs) {%- endcomment -%}
  {% for post in econ_pubs %}
    {% unless printed contains post.title %}
      {% assign yr = post.year %}
      {% if (yr == nil or yr == "") and post.date %}{% assign yr = post.date | date: "%Y" %}{% endif %}
      <li class="one-line-pub">
        <span class="pub-authors">{{ post.authors }}</span>
        ·
        {% if post.link %}
          <a href="{{ post.link }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>
        {% else %}
          <span class="pub-title">“{{ post.title }}”</span>
        {% endif %}
        {% if yr %} ({{ yr }}){% endif %}.
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
.one-line-pub { margin: .35rem 0; }
.pub-authors { font-weight: 500; }
.pub-title { text-decoration: none; }
.pub-venue { font-style: italic; }
</style>
