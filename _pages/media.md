---
layout: archive
title: "Media"
permalink: /media/
author_profile: true
header:
  overlay_image: /lmh.jpg
  overlay_filter: 0.5 # same as adding an opacity of 0.5 to a black background
---

{% include base_path %}

{% for post in site.media reversed %} {% include archive-single.html %} {% endfor %}

