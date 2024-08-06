---
layout: page
title: Events
order: 3
---

{% assign events_speaker = site.data.events | where: 'speaker', true %}
{% assign events_attendee = site.data.events | where: 'speaker', false %}

### As a Speaker

<dl>
{% for event in events_speaker %}
        <li>
            <a href="{{ event.url }}" target="_blank">{{ event.title }}</a>
            <br>
            <div style="font-weight:normal;padding-left:2rem;">
            {{ event.dates }}
            <br>
            Title: <em>{{ event.talk_title }}</em>
             </div>
        </li>
{% endfor %}
</dl>

### As an Attendee

<dl>
{% for event in events_attendee %}
        <li>
            <a href="{{ event.url }}" target="_blank">{{ event.title }}</a>
            <br>
            <div style="font-weight:normal;padding-left:2rem">
            {{ event.dates }}
             </div>
        </li>
{% endfor %}
</dl>