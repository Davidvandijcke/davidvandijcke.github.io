---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: /boe.jpg
  overlay_filter: 0.5
---

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
