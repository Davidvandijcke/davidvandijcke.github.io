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
4) items with venue containing "Revise and Resubmit"
5) all publications from the Econometrics section (econ_pubs)
{%- endcomment -%}

{% assign all_items = site.publications | concat: site.wps %}

{%- comment -%} 1) JMP {%- endcomment -%}
{% assign jmp = all_items | where: "venue", "Job Market Paper" %}

{%- comment -%} 2) Free Discontinuity Regression {%- endcomment -%}
{% assign fdr = all_items | where_exp:"p","p.title and p.title contains 'Free Discontinuity'" %}

{%- comment -%} 3) Metric-Space Conditional Means {%- endcomment -%}
{% assign mscm = all_items | where_exp:"p","p.title and p.title contains 'metric-space conditional means'" %}

{%- comment -%} 4) All R&Rs {%- endcomment -%}
{% assign rr_all = all_items | where_exp:"p","p.venue and p.venue contains 'Revise and Resubmit'" %}

{%- comment -%} 5) All published Econometrics papers {%- endcomment -%}
{% assign econ_pubs = site.publications | where: "field", "Econometrics" %}

{%- comment -%} Build in the requested order {%- endcomment -%}
{% assign selected_raw = jmp | concat: fdr | concat: mscm | concat: rr_all | concat: econ_pubs %}

{%- comment -%} Deduplicate by title using group_by (safe on GitHub Pages) {%- endcomment -%}
{% assign selected_grouped = selected_raw | group_by: "title" %}

{% if selected_grouped.size > 0 %}
## Selected publications
<ul class="selected-list">
  {% for g in selected_grouped %}
    {% assign post = g.items | first %}
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
  {% endfor %}
</ul>
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
