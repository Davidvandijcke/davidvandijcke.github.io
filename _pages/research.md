---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: /boe.jpg
  overlay_filter: 0.5
---

<!-- 
  We'll assume each publication or working paper in your 
  front matter has a "field" that is either 
    "Econometrics" 
  or 
    "Policy & Political Economy"
-->

# Econometrics

<details>
<summary><strong>Publications</strong></summary>

{% for post in site.publications reversed %}
  {% if post.field == "Econometrics" %}
    {% include publication-entry.html post=post %}
  {% endif %}
{% endfor %}

</details>

<details>
<summary><strong>Working Papers</strong></summary>

{% for post in site.wps reversed %}
  {% if post.field == "Econometrics" %}
    {% include publication-entry.html post=post %}
  {% endif %}
{% endfor %}

</details>


# Policy & Political Economy

<details>
<summary><strong>Publications</strong></summary>

{% for post in site.publications reversed %}
  {% if post.field == "Policy & Political Economy" %}
    {% include publication-entry.html post=post %}
  {% endif %}
{% endfor %}

</details>

<details>
<summary><strong>Working Papers</strong></summary>

{% for post in site.wps reversed %}
  {% if post.field == "Policy & Political Economy" %}
    {% include publication-entry.html post=post %}
  {% endif %}
{% endfor %}

</details>
