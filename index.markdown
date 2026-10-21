---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
post_list: true
---

{% for post in site.posts %}
<article class="post-box">
  <h2><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h2>
  {% include post-timestamp.html date=post.date %}
  <div class="post-preview">{{ post.content }}</div>
  <p class="read-more"><a href="{{ post.url | relative_url }}">Read more <span aria-hidden="true">&raquo;</span></a></p>
</article>
{% endfor %}
