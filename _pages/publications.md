---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}


Geometric phase effects in excited state dynamics through a conical intersection in large molecules: N-dimensional linear vibronic coupling model study
Jiaru Li, Loïc Joubert-Doriol, and Artur F. Izmaylov, <i>J. Chem. Phys.<i> 147, 064106 (2017) https://doi.org/10.1063/1.4985925
