// Programmer-style visual effects and interactions

(function() {
  'use strict';

  // Terminal typing effect for headers
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    element.classList.add('typing-cursor');
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('typing-cursor');
      }
    }
    
    type();
  }

  // Matrix rain effect
  function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.05';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = '01';
    const matrixArray = matrix.split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    let matrixInterval = setInterval(draw, 35);

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Return cleanup function
    return () => {
      clearInterval(matrixInterval);
      canvas.remove();
    };
  }

  // Glitch effect on hover
  function addGlitchEffect(element) {
    element.addEventListener('mouseenter', function() {
      this.classList.add('glitch');
    });
    
    element.addEventListener('mouseleave', function() {
      this.classList.remove('glitch');
    });
  }

  // Console-style welcome message
  function consoleWelcome() {
    console.log('%c Welcome to David Van Dijcke\'s Website ', 
      'background: #00ff88; color: #000; font-size: 20px; padding: 10px; font-family: monospace;');
    console.log('%c > Initialized with programmer theme', 
      'color: #00ff88; font-family: monospace;');
    console.log('%c > Feel free to explore the console', 
      'color: #00d4ff; font-family: monospace;');
  }

  // Interactive terminal command palette
  function createCommandPalette() {
    let isOpen = false;
    const commands = {
      'help': 'Show available commands',
      'about': 'Navigate to about page',
      'research': 'Navigate to research page',
      'cv': 'Navigate to CV page',
      'theme': 'Toggle theme',
      'matrix': 'Toggle matrix effect',
      'clear': 'Clear console'
    };

    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    });

    function toggleCommandPalette() {
      if (isOpen) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }

    function openCommandPalette() {
      isOpen = true;
      const palette = document.createElement('div');
      palette.id = 'command-palette';
      palette.innerHTML = `
        <div class="command-palette-overlay"></div>
        <div class="command-palette-modal">
          <input type="text" class="command-input" placeholder="Type a command..." autofocus>
          <div class="command-suggestions"></div>
        </div>
      `;
      
      document.body.appendChild(palette);
      
      const input = palette.querySelector('.command-input');
      const suggestions = palette.querySelector('.command-suggestions');
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        #command-palette {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
        }
        
        .command-palette-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
        }
        
        .command-palette-modal {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 600px;
          background: var(--bg-secondary);
          border: 1px solid var(--primary-color);
          border-radius: 8px;
          box-shadow: 0 0 40px var(--shadow-color);
          overflow: hidden;
        }
        
        .command-input {
          width: 100%;
          padding: 1rem;
          background: transparent;
          border: none;
          color: var(--primary-color);
          font-family: var(--font-mono);
          font-size: 1.2rem;
          outline: none;
        }
        
        .command-input::placeholder {
          color: var(--text-muted);
        }
        
        .command-suggestions {
          max-height: 300px;
          overflow-y: auto;
          border-top: 1px solid var(--border-color);
        }
        
        .command-item {
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .command-item:hover,
        .command-item.active {
          background: var(--bg-hover);
          color: var(--primary-color);
        }
        
        .command-item span {
          float: right;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `;
      document.head.appendChild(style);
      
      // Show all commands initially
      updateSuggestions('');
      
      // Handle input
      input.addEventListener('input', (e) => {
        updateSuggestions(e.target.value);
      });
      
      // Handle command execution
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeCommand(input.value);
        } else if (e.key === 'Escape') {
          closeCommandPalette();
        }
      });
      
      // Click outside to close
      palette.querySelector('.command-palette-overlay').addEventListener('click', closeCommandPalette);
      
      function updateSuggestions(query) {
        suggestions.innerHTML = '';
        Object.entries(commands).forEach(([cmd, desc]) => {
          if (cmd.includes(query.toLowerCase())) {
            const item = document.createElement('div');
            item.className = 'command-item';
            item.innerHTML = `>${ cmd} <span>${desc}</span>`;
            item.addEventListener('click', () => executeCommand(cmd));
            suggestions.appendChild(item);
          }
        });
      }
      
      function executeCommand(cmd) {
        switch(cmd.toLowerCase().trim()) {
          case 'help':
            alert('Available commands:\n' + Object.entries(commands).map(([c, d]) => `${c} - ${d}`).join('\n'));
            break;
          case 'about':
            window.location.href = '/about/';
            break;
          case 'research':
            window.location.href = '/research/';
            break;
          case 'cv':
            window.location.href = '/cv/';
            break;
          case 'theme':
            document.body.classList.toggle('light-theme');
            break;
          case 'matrix':
            toggleMatrix();
            break;
          case 'clear':
            console.clear();
            break;
        }
        closeCommandPalette();
      }
    }

    function closeCommandPalette() {
      isOpen = false;
      const palette = document.getElementById('command-palette');
      if (palette) {
        palette.remove();
      }
    }
  }

  // Particle cursor effect
  function createParticleCursor() {
    const particles = [];
    const mouse = { x: 0, y: 0 };
    
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 100;
        this.element = document.createElement('div');
        this.element.className = 'cursor-particle';
        this.element.style.cssText = `
          position: fixed;
          pointer-events: none;
          width: ${this.size}px;
          height: ${this.size}px;
          background: var(--primary-color);
          border-radius: 50%;
          box-shadow: 0 0 ${this.size * 2}px var(--shadow-color);
          z-index: 9999;
        `;
        document.body.appendChild(this.element);
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.opacity = this.life / 100;
        
        if (this.life <= 0) {
          this.element.remove();
          return false;
        }
        return true;
      }
    }
    
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Create particles on mouse move
      if (Math.random() > 0.8) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    });
    
    function animate() {
      for (let i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].update()) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Progressive enhancement - check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize effects
  document.addEventListener('DOMContentLoaded', function() {
    // Console welcome
    consoleWelcome();
    
    // Typing effect for main title
    const mainTitle = document.querySelector('.page__title, .author__name');
    if (mainTitle && !prefersReducedMotion) {
      const originalText = mainTitle.textContent;
      typeWriter(mainTitle, originalText, 80);
    }
    
    // Add glitch effect to navigation items
    document.querySelectorAll('.greedy-nav a').forEach(addGlitchEffect);
    
    // Command palette
    createCommandPalette();
    
    // Optional effects (can be toggled)
    if (!prefersReducedMotion) {
      // Matrix rain effect (disabled by default for performance)
      // createMatrixRain();
      
      // Particle cursor (subtle effect)
      if (window.innerWidth > 768) {
        createParticleCursor();
      }
    }
    
    // Smooth scroll indicator
    let scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      transition: width 0.3s ease;
      z-index: 10000;
    `;
    document.body.appendChild(scrollIndicator);
    
    window.addEventListener('scroll', () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      scrollIndicator.style.width = scrollPercentage + '%';
    });
    
    // Add "NEW" badge to recent posts/publications
    document.querySelectorAll('.pub-entry, .archive__item').forEach(item => {
      const dateElement = item.querySelector('.page__date, time');
      if (dateElement) {
        const date = new Date(dateElement.getAttribute('datetime') || dateElement.textContent);
        const daysSince = (new Date() - date) / (1000 * 60 * 60 * 24);
        
        if (daysSince < 30) {
          const badge = document.createElement('span');
          badge.className = 'new-badge';
          badge.textContent = 'NEW';
          badge.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--accent-color);
            color: white;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-family: var(--font-mono);
            border-radius: 4px;
            font-weight: bold;
          `;
          item.style.position = 'relative';
          item.appendChild(badge);
        }
      }
    });
  });

  // Expose some functions globally for debugging
  window.programmerTheme = {
    toggleMatrix: createMatrixRain,
    typeWriter: typeWriter,
    consoleWelcome: consoleWelcome
  };

})();