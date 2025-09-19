---
layout: default
header: rg
permalink: /RenaudGagnon/projects
---

<div class="container">
  <h1 class="page-title">My Projects</h1>

  {% for project in site.data.projects %}
    <div class="project-row">
      <div class="project-text">
        <h2>{{ project.title }}</h2>
        <p>{{ project.description }}</p>
      </div>
      <div class="project-carousel" data-folder="{{ project.folder }}" data-id="{{ project.id }}">
        <!-- Carousel will be loaded here by script.js -->
      </div>
    </div>
  {% endfor %}
</div>
