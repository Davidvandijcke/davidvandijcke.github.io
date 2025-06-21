// Ultimate programmer effects - dramatic and impressive

(function() {
  'use strict';

  // Particle system background
  class ParticleSystem {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.init();
    }

    init() {
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      `;
      document.body.appendChild(this.canvas);
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // Create particles
      for (let i = 0; i < 50; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: `hsla(${Math.random() * 60 + 230}, 70%, 70%, 0.5)`
        });
      }
      
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw particles
      this.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
      });
      
      // Draw connections
      this.particles.forEach((p1, i) => {
        this.particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 150) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `hsla(250, 70%, 70%, ${0.2 * (1 - dist / 150)})`;
            this.ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // Typing effect for main headings
  function typeEffect() {
    const headings = document.querySelectorAll('h1, .author__name');
    
    headings.forEach(heading => {
      const text = heading.textContent;
      heading.textContent = '';
      heading.style.visibility = 'visible';
      
      let i = 0;
      const type = () => {
        if (i < text.length) {
          heading.textContent += text.charAt(i);
          i++;
          setTimeout(type, 100);
        }
      };
      
      setTimeout(type, 500);
    });
  }

  // 3D tilt effect on cards
  function tiltEffect() {
    const cards = document.querySelectorAll('.pub-entry, .archive__item, .author__avatar');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 10;
        const angleY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // Spotlight effect following cursor
  function spotlightEffect() {
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    
    document.addEventListener('mousemove', (e) => {
      spotlight.style.left = e.clientX - 300 + 'px';
      spotlight.style.top = e.clientY - 300 + 'px';
    });
    
    document.addEventListener('mouseenter', () => {
      spotlight.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
  }

  // Smooth reveal on scroll
  function scrollReveal() {
    const reveals = document.querySelectorAll('.pub-entry, .archive__item, p, h2, h3');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    reveals.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  }

  // Navigation glow on scroll
  function navGlow() {
    const nav = document.querySelector('.masthead');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.style.boxShadow = '0 8px 32px 0 rgba(129, 140, 248, 0.4)';
      } else {
        nav.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.2)';
      }
    });
  }

  // Click ripple effect
  function rippleEffect() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a, button, .btn')) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleAnimation 0.6s ease-out;
          pointer-events: none;
        `;
        
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    });
  }

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnimation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    body {
      overflow-x: hidden;
    }
    
    /* Loading screen */
    .loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0e27;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      transition: opacity 0.5s ease;
    }
    
    .loader-text {
      font-size: 2rem;
      color: #818cf8;
      font-weight: 700;
      letter-spacing: 2px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);

  // Loading screen
  function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="loader-text">LOADING</div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 1000);
    });
  }

  // Initialize everything
  document.addEventListener('DOMContentLoaded', () => {
    showLoader();
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      new ParticleSystem();
      tiltEffect();
      spotlightEffect();
      rippleEffect();
    }
    
    typeEffect();
    scrollReveal();
    navGlow();
  });

  // Console easter egg
  console.log('%c🚀 Welcome to the Matrix', 'font-size: 24px; color: #818cf8; font-weight: bold;');
  console.log('%cYou found the developer console!', 'font-size: 16px; color: #94a3b8;');
  console.log('%cType unlockSecrets() to see something cool', 'font-size: 14px; color: #64748b;');
  
  window.unlockSecrets = () => {
    document.body.style.animation = 'hueRotate 5s linear infinite';
    const style = document.createElement('style');
    style.textContent = '@keyframes hueRotate { to { filter: hue-rotate(360deg); } }';
    document.head.appendChild(style);
    console.log('%c✨ Secret mode activated!', 'font-size: 20px; color: #a78bfa;');
  };

})();