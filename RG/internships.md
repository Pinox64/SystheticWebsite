---
layout: default
header: portfolio
title: Stages
permalink: /RenaudGagnon/internships/
---
<section class="internships">
  <h1>Mes expériences de stage</h1>
  <div class="internship-grid">
  {% for internship in site.data.internships %}
    <article class="internship-card" data-modal-id="modal-{{ forloop.index }}">
      <img 
        src="{{ 'assets/images/RG/internships/' 
                 | append: internship.logoID 
                 | append: '.webp' 
                 | relative_url }}" 
        alt="{{ internship.business }} logo"
      >
      <div class="internship-details">
        <h2>{{ internship.business }}</h2>
        <p class="meta">{{ internship.location }} – {{ internship.time }}</p>
        <p class="jobtitle">{{ internship.jobtitle }}</p>
        <p class="role">{{ internship.role }}</p>
        
      </div>
    </article>

    <!-- Modal -->
    <div id="modal-{{ forloop.index }}" class="internship-modal" aria-hidden="true">
      <div class="internship-modal-content">
        <button class="internship-modal-close" aria-label="Close">&times;</button>
        <h2>{{ internship.business }}</h2>
        <p><strong>Location:</strong> {{ internship.location }}</p>
        <p><strong>Time:</strong> {{ internship.time }}</p>
        <p><strong>Job:</strong> {{ internship.jobtitle }}</p>
        <p class="description">
          {% if internship.description %}
            {{ internship.description}}
          {% else %}
            No description available.
          {% endif %}
        </p>
      </div>
    </div>
  {% endfor %}
  </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.internship-card').forEach(card => {
    const modal = document.getElementById(card.dataset.modalId);
    const closeBtn = modal.querySelector('.internship-modal-close');

    // open on card click
    card.addEventListener('click', () => {
      modal.setAttribute('aria-hidden','false');
      modal.classList.add('open');
    });

    // close on × click
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      modal.setAttribute('aria-hidden','true');
      modal.classList.remove('open');
    });

    // close when clicking outside content
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.setAttribute('aria-hidden','true');
        modal.classList.remove('open');
      }
    });
  });
});
</script>
