---
layout: archive
title: "Media"
permalink: /media/
author_profile: true
header:
  overlay_image: /lmh.png
  overlay_filter: 0.5 # same as adding an opacity of 0.5 to a black background
---

{% include base_path %}

{% assign econ_pubs = site.media  %}
{% if econ_pubs.size > 0 %}
## Publications
{% for post in econ_pubs reversed %}
  {% include publication-entry.html post=post %}
{% endfor %}
{% endif %}

