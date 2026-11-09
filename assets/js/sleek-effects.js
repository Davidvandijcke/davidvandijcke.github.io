// Sleek professional effects with CV popup

(function() {
  'use strict';

  // Data visualization network background
  class DataNetwork {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.nodes = [];
      this.connections = [];
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
        opacity: 0.3;
      `;
      document.body.appendChild(this.canvas);
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // Create nodes
      for (let i = 0; i < 50; i++) {
        this.nodes.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 3 + 1,
          pulsePhase: Math.random() * Math.PI * 2
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
      
      // Update nodes
      this.nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.02;
        
        // Bounce off edges
        if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        
        // Draw node with pulse effect
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 1.5;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4a9eff';
        this.ctx.fill();
      });
      
      // Draw connections
      this.nodes.forEach((node, i) => {
        this.nodes.slice(i + 1).forEach(otherNode => {
          const dist = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
          if (dist < 150) {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y);
            this.ctx.lineTo(otherNode.x, otherNode.y);
            this.ctx.strokeStyle = `rgba(74, 158, 255, ${0.1 * (1 - dist / 150)})`;
            this.ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // CV Popup functionality
  function initCVPopup() {
    // Create CV modal HTML
    const modal = document.createElement('div');
    modal.className = 'cv-modal';
    modal.innerHTML = `
      <div class="cv-content">
        <div class="cv-header">
          <h2>Curriculum Vitae</h2>
          <button class="close-cv">×</button>
        </div>
        <div class="cv-body">
          <iframe src="/files/CV_DavidVanDijcke.pdf"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add CV trigger button to navigation or sidebar
    const cvLink = document.querySelector('a[href*="/cv"]');
    if (cvLink) {
      cvLink.classList.add('cv-trigger');
      cvLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCVModal();
      });
    }
    
    // Close button functionality
    modal.querySelector('.close-cv').addEventListener('click', closeCVModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCVModal();
    });
    
    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeCVModal();
      }
    });
    
    function openCVModal() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeCVModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Smooth parallax for cards
  function initParallax() {
    const cards = document.querySelectorAll('.pub-entry, .archive__item');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const speed = 0.05;
        const yPos = -(scrolled - rect.top) * speed;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.style.transform = `translateY(${yPos}px)`;
        }
      });
    });
  }

  // Interactive hover effects
  function interactiveCards() {
    const cards = document.querySelectorAll('.pub-entry, .archive__item');
    
    cards.forEach(card => {
      // 3D tilt on hover
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-2px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // Smooth scroll indicator
  function scrollProgress() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #4a9eff, #8b5cf6);
      z-index: 10000;
      transition: width 0.3s ease;
      width: 0%;
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / documentHeight) * 100;
      indicator.style.width = percentage + '%';
    });
  }

  // Smooth reveal on scroll
  function scrollReveal() {
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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    const elements = document.querySelectorAll('.pub-entry, .archive__item, .page__content > p, .page__content > h2, .page__content > h3');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  }

  // Fix text visibility
  function fixTextVisibility() {
    // Ensure all text is visible
    const textElements = document.querySelectorAll('p, li, span, div, h1, h2, h3, h4, h5, h6');
    textElements.forEach(el => {
      if (!el.style.color || el.style.color === 'inherit') {
        const tag = el.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
          el.style.color = '#f1f5f9';
        } else {
          el.style.color = '#cbd5e1';
        }
      }
    });
  }

  // Clean loading animation
  function initLoader() {
    const loader = document.createElement('div');
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1a1f2e;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
      " id="sleek-loader">
        <div style="text-align: center;">
          <div style="
            width: 60px;
            height: 60px;
            border: 3px solid rgba(74, 158, 255, 0.3);
            border-top-color: #4a9eff;
            border-radius: 50%;
            animation: spin 1s ease-in-out infinite;
          "></div>
          <div style="margin-top: 20px; color: #4a9eff; font-family: monospace;">
            Loading...
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.querySelector('#sleek-loader').style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 800);
    });
  }

  // Button ripple effect
  function buttonRipples() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn, button')) {
        const btn = e.target;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleAnim 0.6s ease-out;
          pointer-events: none;
          left: ${x}px;
          top: ${y}px;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    });
  }

  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes rippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize everything
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      new DataNetwork();
      initParallax();
      interactiveCards();
      buttonRipples();
    }
    
    initCVPopup();
    scrollProgress();
    scrollReveal();
    fixTextVisibility();
    
    // Fix layout after content loads
    setTimeout(() => {
      fixTextVisibility();
      
      // Ensure proper spacing
      const sidebar = document.querySelector('.sidebar');
      const archive = document.querySelector('.archive');
      if (sidebar && archive && window.innerWidth >= 1024) {
        sidebar.style.cssText += 'float: left; width: 280px; padding-right: 2rem;';
        archive.style.cssText += 'float: right; width: calc(100% - 300px); padding-left: 1rem;';
      }
    }, 100);
  });

  // Console message
  console.log(
    '%c Welcome to my portfolio ',
    'background: linear-gradient(135deg, #4a9eff, #8b5cf6); color: white; font-size: 18px; padding: 10px 20px; border-radius: 8px; font-weight: 600;'
  );

})();