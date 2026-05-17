'use strict';

/* ── Translations ──────────────────────────────────────────────── */
const ui = {
  en: {
    'nav.work':                     'Work',
    'nav.contact':                  'Contact',
    'nav.cta':                      'Hire Me',
    'hero.eyebrow':                 'Fashion Model · Worldwide bookings',
    'hero.heading':                 'Camilo Anchico<br><span class="hero-heading-role">Fashion Model</span>',
    'hero.sub':                     'Artistic. Intentional. Purposeful.',
    'hero.intro':                   'Selected fashion, e-commerce, and commercial modeling work. Barcelona, Spain based.',
    'hero.cta.primary':             'Book a Casting',
    'hero.cta.secondary':           'View Portfolio',
    'hero.scroll':                  'Scroll',
    'work.title':                   'Selected Work',
    'contact.title':                'Get in Touch',
    'contact.text':                 'Have a project in mind? Let\'s talk about making something great together.',
    'contact.portfolio':            'Full portfolio via direct contact.',
    'form.name':                    'Name',
    'form.email':                   'Email',
    'form.message':                 'Message',
    'form.projectType.label':       'Project Type',
    'form.projectType.placeholder': 'Select an option',
    'form.projectType.ecommerce':   'E-commerce',
    'form.projectType.fashion':     'Fashion Campaign',
    'form.projectType.commercial':  'Commercial',
    'form.projectType.runway':      'Runway',
    'form.projectType.other':       'Other',
    'form.send':                    'Send Message',
    'form.success':                 'Message sent! I\'ll get back to you soon.',
    'form.error':                   'Something went wrong. Please try again or email me directly.',
    'footer.made':                  'Designed &amp; built with care',
  },
  es: {
    'nav.work':                     'Trabajos',
    'nav.contact':                  'Contacto',
    'nav.cta':                      'Contrátame',
    'hero.eyebrow':                 'Modelo de Moda · Reservas internacionales',
    'hero.heading':                 'Camilo Anchico<br><span class="hero-heading-role">Modelo de Moda</span>',
    'hero.sub':                     'Artístico. Intencional. Con propósito.',
    'hero.intro':                   'Trabajo seleccionado de moda, e-commerce y modelaje comercial. Con sede en Barcelona, España.',
    'hero.cta.primary':             'Reservar casting',
    'hero.cta.secondary':           'Ver portafolio',
    'hero.scroll':                  'Scroll',
    'work.title':                   'Proyectos Seleccionados',
    'contact.title':                'Hablemos',
    'contact.text':                 '¿Tienes un proyecto en mente? Hablemos sobre cómo crear algo grande juntos.',
    'contact.portfolio':            'Portafolio completo por contacto directo.',
    'form.name':                    'Nombre',
    'form.email':                   'Correo electrónico',
    'form.message':                 'Mensaje',
    'form.projectType.label':       'Tipo de proyecto',
    'form.projectType.placeholder': 'Selecciona una opción',
    'form.projectType.ecommerce':   'E-commerce',
    'form.projectType.fashion':     'Campaña de moda',
    'form.projectType.commercial':  'Comercial / publicidad',
    'form.projectType.runway':      'Pasarela',
    'form.projectType.other':       'Otro',
    'form.send':                    'Enviar Mensaje',
    'form.success':                 '¡Mensaje enviado! Te responderé pronto.',
    'form.error':                   'Algo salió mal. Por favor, inténtalo de nuevo o escríbeme directamente.',
    'footer.made':                  'Diseñado y construido por HC',
  },
};

/* ── Language ──────────────────────────────────────────────────── */
let lang = 'en';

function applyLang(newLang) {
  lang = newLang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-key]').forEach(el => {
    const v = ui[lang][el.dataset.key];
    if (v !== undefined) el.innerHTML = v;
  });
  document.getElementById('langToggle').textContent = lang === 'en' ? 'ES' : 'EN';
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLang(lang === 'en' ? 'es' : 'en');
});

/* ── Gallery & Lightbox ────────────────────────────────────────── */
const items    = Array.from(document.querySelectorAll('.g-item'));
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCurEl  = document.getElementById('lbCurrent');
const lbTotEl  = document.getElementById('lbTotal');
const total    = items.length;
let   lbIndex  = 0;

lbTotEl.textContent = total;

// Collect full-res src + alt from each gallery item (data-full points at the 2000px JPEG)
const srcs = items.map(item => {
  const img = item.querySelector('img');
  return { src: item.dataset.full || img.src, alt: img.alt };
});

function openLightbox(idx) {
  lbIndex = idx;
  lbImg.src = srcs[idx].src;
  lbImg.alt = srcs[idx].alt;
  lbCurEl.textContent = idx + 1;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  items[lbIndex].focus();
}

function lbGoTo(idx) {
  const next = ((idx % total) + total) % total;
  // Fade out → swap src → fade in
  lbImg.classList.add('switching');
  setTimeout(() => {
    lbIndex = next;
    lbImg.src = srcs[next].src;
    lbImg.alt = srcs[next].alt;
    lbCurEl.textContent = next + 1;
    lbImg.classList.remove('switching');
  }, 250);
}

// Open on click or Enter/Space
items.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => lbGoTo(lbIndex - 1));
document.getElementById('lbNext').addEventListener('click', () => lbGoTo(lbIndex + 1));

// Close on backdrop click
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard: ESC close, arrows navigate
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lbGoTo(lbIndex - 1);
  if (e.key === 'ArrowRight')  lbGoTo(lbIndex + 1);
});

/* ── Header scroll ─────────────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Smooth scroll ─────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Contact form ──────────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = 'https://formspree.io/p/3002536945701093083/f/contactForm';

document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('.submit-btn');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');
  btn.disabled  = true;
  success.classList.remove('visible');
  error.classList.remove('visible');

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error('Submission failed');
    form.reset();
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  } catch {
    error.classList.add('visible');
    setTimeout(() => error.classList.remove('visible'), 5000);
  } finally {
    btn.disabled = false;
  }
});
