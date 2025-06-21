// Unified Effects - Cool animations and interactions

class UnifiedEffects {
  constructor() {
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.initParticleBackground();
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initCVPopup();
    this.fixTextVisibility();
    this.initTypewriter();
  }
  
  // Cool particle background
  initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  // Scroll-triggered animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe all content elements
    document.querySelectorAll('.archive__item, .pub-entry, .page__content > p, .page__content > div').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
  
  // Enhanced hover effects
  initHoverEffects() {
    // Magnetic button effect
    document.querySelectorAll('.social-icons a, .greedy-nav a').forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        link.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translate(0, 0)';
      });
    });
    
    // Ripple effect on click
    document.addEventListener('click', (e) => {
      if (e.target.matches('a, button')) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        `;
        
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    });
  }
  
  // CV Popup functionality
  initCVPopup() {
    // Create modal if it doesn't exist
    if (!document.querySelector('.cv-modal')) {
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
    }
    
    // Find CV links
    const cvLinks = document.querySelectorAll('a[href*="/cv"], a[href*="CV"]');
    const modal = document.querySelector('.cv-modal');
    
    cvLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close handlers
    const closeBtn = modal.querySelector('.close-cv');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Fix text visibility issues
  fixTextVisibility() {
    // Ensure all text content is visible
    const pageContent = document.querySelector('.page__content');
    if (pageContent) {
      // Remove any opacity or visibility styles that might hide content
      pageContent.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.opacity === '0' || computed.visibility === 'hidden') {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        }
      });
      
      // Special handling for homepage content
      const homeContent = pageContent.querySelector('div[style]');
      if (homeContent) {
        homeContent.style.opacity = '1';
        homeContent.style.visibility = 'visible';
        
        // Ensure all paragraphs are visible
        homeContent.querySelectorAll('p').forEach(p => {
          p.style.opacity = '1';
          p.style.visibility = 'visible';
        });
      }
    }
  }
  
  // Cool typewriter effect for the bio
  initTypewriter() {
    const bio = document.querySelector('.author__bio p');
    if (bio && !bio.dataset.typed) {
      const text = bio.textContent;
      bio.textContent = '';
      bio.dataset.typed = 'true';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          bio.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 30);
        }
      };
      
      setTimeout(typeWriter, 500);
    }
  }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize effects
new UnifiedEffects();