// Light Theme Effects - Sophisticated animations and interactions

class LightEffects {
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
    this.initPageLoadAnimation();
    this.initTypewriterEffect();
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initCVPopup();
    this.initCursorTrail();
    this.initSmoothScroll();
    this.initParallaxElements();
    this.initReadingProgress();
    this.fixTextVisibility();
  }
  
  // Page load animation
  initPageLoadAnimation() {
    // Create loading bar
    const loadingBar = document.createElement('div');
    loadingBar.className = 'page-loading';
    document.body.appendChild(loadingBar);
    
    // Remove after animation
    setTimeout(() => loadingBar.remove(), 600);
    
    // Stagger content animation
    const elements = document.querySelectorAll('.page__content > *, .archive__item, .pub-entry');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }
  
  // Typewriter effect for name and titles
  initTypewriterEffect() {
    // Author name typewriter
    const authorName = document.querySelector('.author__name');
    if (authorName && !authorName.dataset.typed) {
      const text = authorName.textContent;
      authorName.textContent = '';
      authorName.dataset.typed = 'true';
      
      // Create cursor
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.textContent = '|';
      cursor.style.cssText = `
        display: inline-block;
        animation: blink 0.7s infinite;
        color: #2563eb;
        font-weight: 300;
      `;
      authorName.appendChild(cursor);
      
      // Type text
      let i = 0;
      const typeChar = () => {
        if (i < text.length) {
          authorName.insertBefore(document.createTextNode(text.charAt(i)), cursor);
          i++;
          setTimeout(typeChar, 80);
        } else {
          setTimeout(() => cursor.style.opacity = '0', 1000);
        }
      };
      
      setTimeout(typeChar, 300);
    }
    
    // Page title typewriter
    const pageTitle = document.querySelector('.page__title, h1');
    if (pageTitle && !pageTitle.dataset.typed && pageTitle.textContent.trim()) {
      const text = pageTitle.textContent;
      pageTitle.textContent = '';
      pageTitle.dataset.typed = 'true';
      
      let i = 0;
      const typeTitle = () => {
        if (i < text.length) {
          pageTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeTitle, 50);
        }
      };
      
      setTimeout(typeTitle, 600);
    }
  }
  
  // Enhanced scroll animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Add number counting animation for stats
          if (entry.target.classList.contains('stat-number')) {
            this.animateNumber(entry.target);
          }
        }
      });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.archive__item, .pub-entry, .page__content > p, .page__content > div').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Number counting animation
  animateNumber(element) {
    const target = parseInt(element.dataset.target || element.textContent);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateNumber = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = target;
      }
    };
    
    updateNumber();
  }
  
  // Enhanced hover effects
  initHoverEffects() {
    // Magnetic links
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
        
        link.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
      });
    });
    
    // Button ripple effect
    document.addEventListener('click', (e) => {
      if (e.target.matches('a, button')) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.3);
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
  
  // Subtle cursor trail effect
  initCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.1s ease, opacity 0.3s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(trail);
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animateTrail() {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;
      
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
      
      requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
    
    // Hide on mouse leave
    document.addEventListener('mouseleave', () => {
      trail.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      trail.style.opacity = '1';
    });
  }
  
  // Smooth scroll behavior
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
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
  
  // Parallax effect for images
  initParallaxElements() {
    const parallaxElements = document.querySelectorAll('.author__avatar img, .page__hero img');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const rate = scrolled * -0.5;
        el.style.transform = `translateY(${rate}px)`;
      });
    });
  }
  
  // Reading progress indicator
  initReadingProgress() {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      z-index: 9999;
      transition: width 0.1s ease;
      width: 0%;
    `;
    document.body.appendChild(progress);
    
    window.addEventListener('scroll', () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const scrolled = window.scrollY;
      const percent = (scrolled / docHeight) * 100;
      
      progress.style.width = percent + '%';
    });
  }
  
  // Fix text visibility
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
}

// Add necessary CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize effects
new LightEffects();