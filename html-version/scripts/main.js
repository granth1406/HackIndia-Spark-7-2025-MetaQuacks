/**
 * Main JavaScript for ProofPass HTML version
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initHeader();
    initScrollAnimations();
    initTestimonialsSlider();
    init3DCardEffect();
});

/**
 * Header & Navigation functionality
 */
function initHeader() {
    // Header scroll effect
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Handle header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileNav.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-menu-btn') && 
            !e.target.closest('.mobile-nav') && 
            !mobileNav.classList.contains('hidden')) {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });
}

/**
 * Scroll animations for sections and elements
 */
function initScrollAnimations() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    const revealSections = document.querySelectorAll('.reveal');
    
    revealSections.forEach((section) => {
        gsap.fromTo(
            section, 
            { opacity: 0, y: 30 }, 
            {
                opacity: 1, 
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
        
        // Animate child elements with staggered delay
        const revealItems = section.querySelectorAll('.reveal-item');
        if (revealItems.length) {
            gsap.fromTo(
                revealItems, 
                { opacity: 0, y: 20 }, 
                {
                    opacity: 1, 
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    });
}

/**
 * Testimonials slider functionality
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.slider-dots');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight) * 2;
    
    // Hide all slides except the active one on mobile
    function updateSlides() {
        if (window.innerWidth < 768) {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentIndex ? 'block' : 'none';
            });
        } else {
            slides.forEach(slide => {
                slide.style.display = 'block';
            });
            
            // For larger screens, create a carousel effect
            slider.scrollLeft = currentIndex * slideWidth;
        }
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Initialize slider
    updateSlides();
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlides();
        });
    });
    
    // Update slider on window resize
    window.addEventListener('resize', updateSlides);
}

/**
 * 3D effect for credential card
 */
function init3DCardEffect() {
    const card = document.querySelector('.credential-card');
    
    if (!card) return;
    
    // Variables for card rotation
    let bounds;
    let mouseX = 0;
    let mouseY = 0;
    
    function rotateCard() {
        if (!bounds) bounds = card.getBoundingClientRect();
        
        // Calculate rotation based on mouse position
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        
        const rotateY = ((mouseX - centerX) / (bounds.width / 2)) * 15;
        const rotateX = ((centerY - mouseY) / (bounds.height / 2)) * 15;
        
        // Apply transform
        card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        
        // Add shine effect
        const shine = mouseX - bounds.left;
        const percentage = Math.max(0, Math.min(1, shine / bounds.width)) * 100;
        
        card.style.background = `
            linear-gradient(${percentage}deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)),
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
        `;
    }
    
    // Mouse movement event
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Only rotate if mouse is near the card
        if (bounds && 
            mouseX > bounds.left - 100 && 
            mouseX < bounds.right + 100 && 
            mouseY > bounds.top - 100 && 
            mouseY < bounds.bottom + 100) {
            requestAnimationFrame(rotateCard);
        }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(10deg) rotateX(5deg)';
    });
    
    // Recalculate bounds on window resize
    window.addEventListener('resize', () => {
        bounds = card.getBoundingClientRect();
    });
    
    // Touch support for mobile
    card.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        rotateCard();
    });
}