---
layout: default
header: portfolio
title: Projects
permalink: /RenaudGagnon/projects/
---

<section class="projects-list">
  {% for proj in site.data.projects %}
    <section class="project-row" id="{{ proj.id }}">
      <div class="project-text">
        <h2>{{ proj.title }}</h2>
        <p>{{ proj.description }}</p>
      </div>
      <div class="project-carousel" data-folder="{{ proj.folder }}">
        {% for file in site.static_files %}
          {% if file.path contains proj.folder %}
            <img src="{{ file.path | relative_url }}"
                 alt="{{ proj.title }} image {{ forloop.index }}">
          {% endif %}
        {% endfor %}
      </div>
      
    </section>
  {% endfor %}
</section>
