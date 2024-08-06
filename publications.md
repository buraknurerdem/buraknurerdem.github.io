---
layout: page
title: Publications
order: 1
---

{% assign list_wip = site.data.pubs | where: 'upcoming', true %}
{% assign list_prep = site.data.pubs | where: 'preprint', true %}
{% assign list = site.data.pubs | where: 'published', true %}

### Preprints

<dl>
{% assign count = list_prep.size | plus: list.size %}
{% for pub in list_prep %}
  <dd style="margin-left: 30px;"><p style='margin-left: -35px !important;
  position: absolute; font-size: smaller;'>[{{ count }}] </p> <b>{{ pub.title }} </b> <br/>
  with {{ pub.authors }}, {{ pub.npages }} pages, {{ pub.year }}{% if pub.submitted %}. <i>Submitted</i>{% endif %}<br/>
<a href="{{ pub.arxivurl }}" target="_blank">arXiv</a> - 
<a href="{{  site.baseurl }}{{ pub.pdf }}" target="_blank"><i class="fa-regular fa-file-pdf" aria-hidden="true"></i></a>
<!-- {% if pub.accepted %}(<i>accepted for publication on {{ pub.accjourn }}</i>){% endif %} --></dd>
{% assign count = count | plus: -1 %}
{% endfor %}    
</dl>