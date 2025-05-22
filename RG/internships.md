---
layout: default
header: portfolio
title: Internships
permalink: /RenaudGagnon/internships/
---
<section class="internships">
  <h1>Internships</h1>

  <div class="internship-grid">
  {% for internship in site.data.internships %}
    <article class="internship-card">
      <a href="{{ internship.link }}">
        <img 
          src="{{ 'assets/images/RG/internships/' 
                   | append: internship.logoID 
                   | append: '.webp' 
                   | relative_url }}" 
          alt="{{ internship.business }} logo"
        >
      </a>
      <div class="internship-details">
        <h2><a href="{{ internship.link }}">{{ internship.business }}</a></h2>
        <p class="location">{{ internship.location }}</p>
        <p class="time">{{ internship.time }}</p>
        <p class="jobtitle">{{ internship.jobtitle }}</p>
      </div>
    </article>
  {% endfor %}
  </div>
</section>
