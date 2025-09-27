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
Selected publications: explicit curation, ordered.
Order:
  1) Job Market Paper (by venue == "Job Market Paper")
  2) Free Discontinuity Regression
  3) A Test for Jumps in Metric-Space Conditional Means
  4) Return to Office and the Tenure Distribution  (Revision Requested: REStat, 2025)
  5) Refugee Return and Conflict: Evidence from a Natural Experiment (Revision Requested: AER, 2025)
  6) Science Skepticism Reduces Compliance with COVID-19 Shelter-in-Place Policies (NHB, 2021)
  7) Unmasking Partisanship: Polarization undermines public response to collective risk (JPubE, 2021)
  8) Public response to government alerts saves lives during Russian invasion of Ukraine (PNAS, 2023)
We match titles case-insensitively.
{% endcomment %}

{% assign all_items = site.publications | concat: site.wps %}

{% assign printed = "" %}
{% assign t_fdr   = "free discontinuity regression" %}
{% assign t_mscm  = "a test for jumps in metric-space conditional means" %}
{% assign t_rto   = "return to office and the tenure distribution" %}
{% assign t_ref   = "refugee return and conflict: evidence from a natural experiment" %}
{% assign t_nhb   = "science skepticism reduces compliance with covid-19 shelter-in-place policies" %}
{% assign t_jpube = "unmasking partisanship: polarization undermines public response to collective risk" %}
{% assign t_pnas  = "public response to government alerts saves lives during russian invasion of ukraine" %}

{% capture selected_list %}
<ul class="selected-list">

  {%- comment -%} 1) Job Market Paper by venue {%- endcomment -%}
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
          {% if href != "" %}<a href="{{ href }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>{% else %}<span class="pub-title">“{{ post.title }}”</span>{% endif %}
          {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}. <em class="pub-venue">{{ post.venue }}</em>
        </li>
        {% assign printed = printed | append: "||" | append: post.title %}
      {% endunless %}
    {% endif %}
  {% endfor %}

  {%- comment -%} helper: render-by-title (repeat block; no macros in GH Pages) {%- endcomment -%}
  {% assign targets = t_fdr | append:"||" | append:t_mscm | append:"||" | append:t_rto | append:"||" | append:t_ref | append:"||" | append:t_nhb | append:"||" | append:t_jpube | append:"||" | append:t_pnas %}
  {% assign targets_list = targets | split:"||" %}

  {% for target in targets_list %}
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
            {% if href != "" %}<a href="{{ href }}" class="pub-title" target="_blank" rel="noopener">“{{ post.title }}”</a>{% else %}<span class="pub-title">“{{ post.title }}”</span>{% endif %}
            {% if yr %} <span class="pub-year">({{ yr }})</span>{% endif %}. <em class="pub-venue">{{ post.venue }}</em>
          </li>
          {% assign printed = printed | append: "||" | append: post.title %}
        {% endunless %}
      {% endif %}
    {% endfor %}
  {% endfor %}

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
/* Selected block: widen only this section */
.selected-wide{
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* One-line styling */
.selected-list { list-style: none; padding-left: 0; margin-left: 0; }
.one-line-pub { margin: .35rem 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pub-authors { font-weight: 500; }
.pub-title { text-decoration: none; border-bottom: 1px solid rgba(0,0,0,.15); }
.pub-title:hover { border-bottom-color: rgba(0,0,0,.35); }
.pub-year { color: #666; }
.pub-venue { font-style: italic; color: #444; }
.sep { color: #aaa; }
</style>
