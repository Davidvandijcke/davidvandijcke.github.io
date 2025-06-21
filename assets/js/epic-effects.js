// Epic visual effects - Maximum coolness

(function() {
  'use strict';

  // Matrix rain effect with custom characters
  class MatrixRain {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.1;
      `;
      document.body.appendChild(this.canvas);
      
      this.columns = 0;
      this.drops = [];
      this.fontSize = 14;
      this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = Math.floor(this.canvas.width / this.fontSize);
      this.drops = Array(this.columns).fill(1);
    }

    animate() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#00ff88';
      this.ctx.font = `${this.fontSize}px monospace`;
      
      for (let i = 0; i < this.drops.length; i++) {
        const text = this.chars[Math.floor(Math.random() * this.chars.length)];
        this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
        
        if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      }
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // Holographic card effect
  function holoCards() {
    const cards = document.querySelectorAll('.pub-entry, .archive__item');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        
        // Holographic gradient effect
        const gradientX = (x / rect.width) * 100;
        const gradientY = (y / rect.height) * 100;
        card.style.background = `
          radial-gradient(circle at ${gradientX}% ${gradientY}%, 
            rgba(0, 217, 255, 0.2) 0%, 
            transparent 50%),
          var(--bg-card)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.background = 'var(--bg-card)';
      });
    });
  }

  // Neon text glow on hover
  function neonText() {
    const links = document.querySelectorAll('a, h1, h2, h3');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
        this.style.textShadow = `
          0 0 10px currentColor,
          0 0 20px currentColor,
          0 0 30px currentColor,
          0 0 40px currentColor
        `;
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.textShadow = '';
      });
    });
  }

  // Particle explosion on click
  function particleExplosion() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a, button, .btn')) {
        createExplosion(e.clientX, e.clientY);
      }
    });
    
    function createExplosion(x, y) {
      const colors = ['#00d9ff', '#b24bf3', '#00ff88', '#ff6b2b', '#ff0080'];
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          width: 4px;
          height: 4px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          left: ${x}px;
          top: ${y}px;
          box-shadow: 0 0 6px currentColor;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let opacity = 1;
        
        const animate = () => {
          x += vx;
          y += vy;
          opacity -= 0.03;
          
          particle.style.left = x + 'px';
          particle.style.top = y + 'px';
          particle.style.opacity = opacity;
          
          if (opacity > 0) {
            requestAnimationFrame(animate);
          } else {
            particle.remove();
          }
        };
        
        requestAnimationFrame(animate);
      }
    }
  }

  // Smooth parallax scrolling
  function parallaxScroll() {
    const elements = document.querySelectorAll('.author__avatar, .page__hero, h1, h2');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      elements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Terminal typing effect for headers
  function terminalType() {
    const headers = document.querySelectorAll('h1, .author__name');
    
    headers.forEach(header => {
      const text = header.textContent;
      header.textContent = '';
      header.style.visibility = 'visible';
      
      let i = 0;
      const cursor = document.createElement('span');
      cursor.style.cssText = `
        color: var(--accent-cyan);
        animation: blink 1s infinite;
      `;
      cursor.textContent = '_';
      header.appendChild(cursor);
      
      const type = () => {
        if (i < text.length) {
          header.textContent = text.substring(0, i + 1);
          header.appendChild(cursor);
          i++;
          setTimeout(type, 100);
        } else {
          cursor.style.animation = 'none';
        }
      };
      
      setTimeout(type, 500);
    });
  }

  // Cyber grid animation
  function cyberGrid() {
    const grid = document.createElement('div');
    grid.className = 'cyber-grid';
    grid.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.03;
      background-image: 
        linear-gradient(rgba(0, 217, 255, 0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 217, 255, 0.5) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 10s linear infinite;
    `;
    
    document.body.appendChild(grid);
  }

  // Interactive mouse trail
  function mouseTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--accent-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: ${1 - (i / trailLength)};
        transform: scale(${1 - (i / trailLength)});
        box-shadow: 0 0 ${10 - (i / 2)}px var(--accent-cyan);
      `;
      document.body.appendChild(dot);
      trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animate() {
      let x = mouseX;
      let y = mouseY;
      
      trail.forEach((dot, index) => {
        const nextDot = trail[index + 1] || trail[0];
        
        if (index === 0) {
          dot.style.left = x + 'px';
          dot.style.top = y + 'px';
        } else {
          dot.style.left = nextDot.style.left;
          dot.style.top = nextDot.style.top;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Epic loading screen
  function epicLoader() {
    const loader = document.createElement('div');
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0f1419;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        flex-direction: column;
      " id="epic-loader">
        <div style="position: relative; margin-bottom: 30px;">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00d9ff;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#b24bf3;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient)" stroke-width="2" opacity="0.3"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient)" stroke-width="2" 
              stroke-dasharray="500" stroke-dashoffset="500"
              style="animation: drawCircle 2s ease-in-out forwards;">
            </circle>
            <text x="100" y="110" text-anchor="middle" fill="#00d9ff" font-family="monospace" font-size="24" font-weight="bold">
              LOADING
            </text>
          </svg>
        </div>
        <div style="color: #00d9ff; font-family: monospace; font-size: 14px;">
          <span style="animation: pulse 1s ease-in-out infinite;">Initializing system...</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loader.remove(), 500);
      }, 1500);
    });
  }

  // Add animations CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drawCircle {
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Initialize everything
  document.addEventListener('DOMContentLoaded', () => {
    epicLoader();
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      new MatrixRain();
      holoCards();
      neonText();
      particleExplosion();
      parallaxScroll();
      mouseTrail();
      cyberGrid();
    }
    
    terminalType();
    
    // Staggered content reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.pub-entry, .archive__item, p').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  });

  // Console ASCII art
  console.log(`%c
  ███████╗██████╗ ██╗ ██████╗
  ██╔════╝██╔══██╗██║██╔════╝
  █████╗  ██████╔╝██║██║     
  ██╔══╝  ██╔═══╝ ██║██║     
  ███████╗██║     ██║╚██████╗
  ╚══════╝╚═╝     ╚═╝ ╚═════╝
  `, 'color: #00d9ff; font-family: monospace;');
  
  console.log('%c> System initialized', 'color: #00ff88; font-family: monospace;');
  console.log('%c> Welcome to the future', 'color: #b24bf3; font-family: monospace;');

})();