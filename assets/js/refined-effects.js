// Refined interactive effects for professional programmer theme

(function() {
  'use strict';

  // Smooth parallax scrolling for depth
  function initParallax() {
    const elements = document.querySelectorAll('.author__avatar img, .page__hero');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      elements.forEach(el => {
        const speed = el.dataset.parallaxSpeed || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Magnetic hover effect for interactive elements
  function magneticHover() {
    const magnets = document.querySelectorAll('.btn, .social-icons a');
    
    magnets.forEach(magnet => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        magnet.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        magnet.style.transition = 'transform 0.1s ease';
      });
      
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0, 0)';
        magnet.style.transition = 'transform 0.3s ease';
      });
    });
  }

  // Dynamic content loading with fade effect
  function observeContent() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Add observer to content elements
    document.querySelectorAll('.pub-entry, .archive__item, .page__content > *').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Smart navigation highlighting based on scroll position
  function scrollSpy() {
    const sections = document.querySelectorAll('section[id], .page__section[id]');
    const navLinks = document.querySelectorAll('.greedy-nav a[href^="#"]');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    });
  }

  // Reading progress indicator
  function readingProgress() {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
      z-index: 10000;
      transition: width 0.2s ease;
    `;
    document.body.appendChild(progress);
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / documentHeight) * 100;
      progress.style.width = percentage + '%';
    });
  }

  // Interactive hover cards for publications
  function enhancePublications() {
    const publications = document.querySelectorAll('.pub-entry');
    
    publications.forEach(pub => {
      // Add interactive hover state
      pub.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
      });
      
      // Click to expand/collapse abstract
      const details = pub.querySelector('.pub-details');
      if (details) {
        pub.addEventListener('click', function(e) {
          if (!e.target.closest('a') && !e.target.closest('summary')) {
            const summary = details.querySelector('summary');
            if (summary) {
              summary.click();
            }
          }
        });
      }
    });
  }

  // Smooth scroll for anchor links
  function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Dynamic theme switcher
  function themeSwitcher() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: var(--shadow-md);
    `;
    
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    });
    
    document.body.appendChild(themeToggle);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  // Add subtle hover sound effects (optional)
  function hoverSounds() {
    const hoverElements = document.querySelectorAll('.btn, .social-icons a');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        // Create a subtle click sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.01;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      });
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      initParallax();
      magneticHover();
      observeContent();
    }
    
    // These enhance functionality without motion
    scrollSpy();
    readingProgress();
    enhancePublications();
    smoothScroll();
    themeSwitcher();
    
    // Optional: Add hover sounds (commented out by default)
    // hoverSounds();
    
    // Add loaded class for CSS animations
    document.body.classList.add('is-loaded');
  });

  // Enhanced console message
  console.log(
    '%c Welcome to David Van Dijcke\'s Website ',
    'background: linear-gradient(90deg, #5e72e4, #825ee4); color: white; font-size: 16px; padding: 10px 20px; border-radius: 5px; font-weight: bold;'
  );

})();

// CSS for visible state
const style = document.createElement('style');
style.textContent = `
  .is-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  body.is-loaded .page__content {
    opacity: 1;
  }
  
  [data-theme="dark"] {
    --text-primary: #f8f9fa;
    --text-secondary: #e9ecef;
    --text-muted: #adb5bd;
    --text-light: #6c757d;
    --bg-primary: #0d1117;
    --bg-secondary: #161b22;
    --bg-tertiary: #21262d;
    --bg-card: #161b22;
    --border-color: #30363d;
  }
`;
document.head.appendChild(style);