// Data visualization inspired effects - cool as fuck

(function() {
  'use strict';

  // Interactive data particles that follow cursor
  class DataParticles {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: 0, y: 0 };
      this.colors = ['#3b82f6', '#f97316', '#8b5cf6', '#14b8a6', '#ec4899'];
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
        z-index: 999;
      `;
      document.body.appendChild(this.canvas);
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
      
      // Create initial particles
      for (let i = 0; i < 100; i++) {
        this.createParticle();
      }
      
      this.animate();
    }

    createParticle() {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        life: 1,
        connections: []
      });
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw particles
      this.particles.forEach((particle, i) => {
        // Mouse interaction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx += (dx / dist) * force * 0.5;
          particle.vy += (dy / dist) * force * 0.5;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.life;
        this.ctx.fill();
        
        // Draw connections
        this.particles.slice(i + 1).forEach(p2 => {
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distance < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = particle.color;
            this.ctx.globalAlpha = (1 - distance / 100) * 0.3;
            this.ctx.stroke();
          }
        });
      });
      
      this.ctx.globalAlpha = 1;
      requestAnimationFrame(() => this.animate());
    }
  }

  // Scroll progress with data visualization
  function scrollProgress() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f97316);
      z-index: 10000;
      transition: width 0.3s ease;
      width: 0%;
    `;
    document.body.appendChild(indicator);
    
    // Update CSS variable for gradient background
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / documentHeight) * 100;
      
      indicator.style.width = percentage + '%';
      document.body.style.setProperty('--scroll-progress', percentage + '%');
    });
  }

  // 3D card tilt effect
  function init3DTilt() {
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
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
        card.style.boxShadow = `${angleY * 2}px ${angleX * 2}px 30px rgba(59, 130, 246, 0.3)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });
  }

  // Typing animation with data stream effect
  function dataTyping() {
    const elements = document.querySelectorAll('h1, .author__name');
    
    elements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      el.style.visibility = 'visible';
      
      let i = 0;
      const type = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          
          // Add random data characters
          if (Math.random() > 0.8) {
            const dataChar = document.createElement('span');
            dataChar.textContent = Math.random() > 0.5 ? '1' : '0';
            dataChar.style.cssText = `
              color: #3b82f6;
              opacity: 0.3;
              font-size: 0.8em;
              position: absolute;
              animation: dataDrop 1s ease-out forwards;
            `;
            el.appendChild(dataChar);
            setTimeout(() => dataChar.remove(), 1000);
          }
          
          i++;
          setTimeout(type, 50);
        }
      };
      
      setTimeout(type, 500);
    });
  }

  // Interactive hover effects with data visualization
  function interactiveHovers() {
    // Links with data point animation
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('mouseenter', function() {
        const point = document.createElement('span');
        point.style.cssText = `
          position: absolute;
          width: 6px;
          height: 6px;
          background: #f97316;
          border-radius: 50%;
          pointer-events: none;
          animation: orbit 2s linear infinite;
        `;
        this.style.position = 'relative';
        this.appendChild(point);
        
        setTimeout(() => point.remove(), 2000);
      });
    });
    
    // Buttons with ripple effect
    document.querySelectorAll('.btn, button').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
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
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
          left: ${x}px;
          top: ${y}px;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Smooth reveal animations
  function scrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            
            // Add stagger effect for list items
            if (entry.target.classList.contains('pub-entry')) {
              entry.target.style.animationDelay = `${index * 0.1}s`;
            }
          }, index * 50);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.pub-entry, .archive__item, section > *, article > *');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px) scale(0.95)';
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  }

  // Cool loading animation
  function initLoader() {
    const loader = document.createElement('div');
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fafbfc;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
      " id="data-loader">
        <div style="position: relative;">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.2"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" stroke-width="2" 
              stroke-dasharray="314" stroke-dashoffset="314"
              style="animation: loadCircle 2s ease-in-out infinite;">
            </circle>
            <circle cx="60" cy="30" r="5" fill="#f97316" style="animation: orbitDot 2s linear infinite;"/>
            <circle cx="90" cy="60" r="5" fill="#8b5cf6" style="animation: orbitDot 2s linear infinite 0.5s;"/>
            <circle cx="60" cy="90" r="5" fill="#14b8a6" style="animation: orbitDot 2s linear infinite 1s;"/>
            <circle cx="30" cy="60" r="5" fill="#ec4899" style="animation: orbitDot 2s linear infinite 1.5s;"/>
          </svg>
          <div style="text-align: center; margin-top: 20px; font-weight: 600; color: #4b5563;">
            Loading Data...
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.querySelector('#data-loader').style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 1000);
    });
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dataDrop {
      to {
        transform: translateY(20px);
        opacity: 0;
      }
    }
    
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(20px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
    }
    
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes loadCircle {
      0%, 100% { stroke-dashoffset: 314; }
      50% { stroke-dashoffset: 0; }
    }
    
    @keyframes orbitDot {
      from { transform: rotate(0deg) translateX(30px) rotate(0deg); }
      to { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
    }
  `;
  document.head.appendChild(style);

  // Initialize everything
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      new DataParticles();
      init3DTilt();
      interactiveHovers();
    }
    
    scrollProgress();
    dataTyping();
    scrollReveal();
    
    // Add loaded class
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  });

  // Console message
  console.log(
    '%c📊 Welcome to my data-driven world ',
    'background: linear-gradient(90deg, #3b82f6, #8b5cf6); color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px; font-weight: bold;'
  );
  
  // Secret konami code for fun effect
  let konamiCode = [];
  const secretCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === secretCode.join(',')) {
      document.body.style.animation = 'rainbow 5s linear infinite';
      const style = document.createElement('style');
      style.textContent = `
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      console.log('%c🎉 Secret mode activated!', 'font-size: 24px; color: #f97316;');
    }
  });

})();