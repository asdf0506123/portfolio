document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navBar = document.querySelector('.nav-bar');
    const navLinks = document.querySelectorAll('.nav-link, .opciones a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navBar.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navBar.classList.remove('active');
        });
    });

    // 2. Navbar Background on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const fadeElements = document.querySelectorAll('.fade-in');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        fadeElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };

    // Initial check and event listener
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // 4. Modal Logic
    window.openModal = function(id) {
        document.getElementById(id).classList.add('active');
    };

    window.closeModal = function(id) {
        document.getElementById(id).classList.remove('active');
    };

    // Close when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // 5. Project carousel controls

const carousel = document.querySelector('.group');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');


let position = 0;


nextBtn.addEventListener('click', () => {

    position -= 300;

    if(position < -600){
        position = 0;
    }

    carousel.style.transform = `translateX(${position}px)`;

});


prevBtn.addEventListener('click', () => {
    position += 300;

    if(position > 0){
        position = -600;
    }
    carousel.style.transform = `translateX(${position}px)`;
});
});
