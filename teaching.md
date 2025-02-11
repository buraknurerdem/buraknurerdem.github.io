---
layout: page
title: Teaching
order: 2
---
<!-- Some space before terms start -->
<div style="height: 1rem;"></div> 

{% assign teaching_data = site.data.teaching %}

<dl>
{% for item in teaching_data %}
  <dt style="margin-bottom:-10px">{{ item.term }}</dt>
  <dd>
    <ul>
    {% for course in item.courses %}
      <!-- <li style="font-size:18px"><b>{{ course.name }}</b> ({{ course.type }})</li> -->
      <li style="font-size:18px">
          {% if course.href %}
            <b><a href="{{ course.href }}">{{ course.name }}</a></b>
          {% else %}
            <b>{{ course.name }}</b>
          {% endif %}
          ({{ course.type }})
        </li>
    {% endfor %}
    </ul>
  </dd>
{% endfor %}
</dl>
