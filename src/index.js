document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile menu
  const menuToggle = document.getElementById('mobile-menu')
  const navLinks = document.querySelector('.nav-links')
  const navAnchors = document.querySelectorAll('.nav-links a')

  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active')
    navLinks.classList.toggle('active')
  })

  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active')
      navLinks.classList.remove('active')
    })
  })

  // 2. Navbar background on scroll
  const navbar = document.getElementById('navbar')
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60)
  })

  // 3. Scroll reveal with IntersectionObserver
  const revealEls = document.querySelectorAll('.section, .project-card, .video-frame, .art-item, .about-grid')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })

  revealEls.forEach(el => {
    el.classList.add('reveal')
    observer.observe(el)
  })

  // 4. Random tilt on art items
  document.querySelectorAll('.art-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const tilt = (Math.random() - 0.5) * 4
      item.style.transform = `translateY(-6px) rotate(${tilt}deg)`
    })
    item.addEventListener('mouseleave', () => {
      item.style.transform = ''
    })
  })

  // 5. Project cards staggered entrance on scroll
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.setProperty('--i', i)
    card.style.transitionDelay = `${i * 0.08}s`
  })

  // 6. Playful wiggle on tag hover
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = `rotate(${(Math.random() - 0.5) * 8}deg) scale(1.05)`
    })
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = ''
    })
  })
})
