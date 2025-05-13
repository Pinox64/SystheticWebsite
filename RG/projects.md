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
      <section class="carousel" data-folder="{{ proj.folder }}">
      <button class="ctrl prev" aria-label="Previous slide">&#10094;</button>
      <div class="track-wrapper">
        <ul class="track">
        {% for file in site.static_files %}
          {% if file.path contains proj.folder %}
          <li class="slide">
            <img src="{{ file.path | relative_url }}"
                 alt="{{ proj.title }} image {{ forloop.index }}">
          </li>
          {% endif %}
        {% endfor %}
        </ul>
      </div>
      <button class="ctrl next" aria-label="Next slide">&#10095;</button>
      </section>
      
    </section>
  {% endfor %}
</section>
