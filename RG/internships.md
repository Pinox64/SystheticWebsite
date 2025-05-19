---
layout: default
header: portfolio
title: Internships
permalink: /RenaudGagnon/internships/
---

<section class="internships">
  <h1>Internships</h1>
  <ul>
  {% for internship in site.data.internships %}
    <li><strong> <a href="{{internship.link}}"><img src='assets/images/RG/'+ {{internship.businessID}}></a>, {{internship.business}} {{internsip.location}} </strong> – {{internship.time}} – {{internship.jobtitle}} – {{internship.role}} </li>
  {%endfor%}
  </ul>
</section>
