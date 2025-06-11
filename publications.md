---
layout: page
title: Publications
order: 1
---

{% assign list_wip = site.data.pubs | where: 'upcoming', true %}
{% assign list_prep = site.data.pubs | where: 'preprint', true %}
{% assign list = site.data.pubs | where: 'published', true %}

<!-- ### Preprints -->

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


<br/>
### Published
<div style="height:20px;font-size:1px;">&nbsp;</div>
<dl>
{% assign list = site.data.pubs | where: 'published', true %}
{% assign count = list.size %}
{% for pub in list %}
  <!--dt>  {{ pub.title }} with {{ pub.authors }}
  </dt-->
  <dd style="margin-left: 30px;"><p style='margin-left: -30px !important;
  position: absolute;'>[{{ count }}]</p> <a href="{{ pub.doi }}" target="_blank" style='color:#4169e1;'>{{ pub.title }}</a><br/> with {{ pub.authors }}.&nbsp;<br/><b>{{ pub.journal }}</b> {% if pub.volume %}{{ pub.volume }},{% endif %} {% if pub.pages %}{{ pub.pages }},{% endif%} {{ pub.npages }} pages{% if pub.year %}, {{ pub.year }}{% endif %}.<br/> {% if pub.abstract %}
  <details>
    <summary style="font-size:13pt;"><i>Abstract</i> </summary>
    <p style="font-size:11.5pt;">{{ pub.abstract }}</p>
    </details>
{% endif %}
  <a href="{{ pub.arxivurl }}" target="_blank" >Arxiv: {{ pub.arxivcode }}</a>{% if pub.halurl %} - <a href="{{ pub.halurl }}" target="_blank"><i class="ai ai-hal ai-align-center-1x"></i></a>{% endif %}{% if pub.rg %} - <a href="https://www.researchgate.net/publication/{{ pub.rg }}" target="_blank"><i class="ai ai-researchgate ai-align-center-1x"></i></a>{% endif %}{% if pub.academia %} - <a href="https://www.academia.edu/{{ pub.academia }}" target="_blank"><i class="ai ai-academia ai-align-center-1x"></i></a>{% endif %} - <a href="{{  site.baseurl }}{{ pub.pdf }}" target="_blank"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>
  <br/><br/>
  </dd>
{% assign count = count | plus: -1 %}
{% endfor %}
</dl>