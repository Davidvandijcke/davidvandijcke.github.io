// Enhanced Effects - Professional animations with mobile optimization

class EnhancedEffects {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }
  
  init() {
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
    if (!this.isMobile) {
      // this.initCursorTrail(); // Disabled blue cursor dot
      this.initInteractiveBackground();
    }
    this.initSmoothScroll();
    this.initParallaxElements();
    this.initReadingProgress();
    this.initPageTransitions();
    this.initPublicationSearch();
    this.initSmartNavigation();
    this.initAnimatedStats();
    this.initTooltips();
    this.enhanceResearchAssistant();
    this.fixTextVisibility();
    this.fixMobileLayout();
  }
  
  // Fix mobile layout issues
  fixMobileLayout() {
    if (this.isMobile) {
      // Ensure proper viewport height
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      
      // Fix content cut-off
      const mainContent = document.querySelector('.page__content');
      if (mainContent) {
        mainContent.style.paddingBottom = '4rem';
      }
      
      // Ensure footer doesn't overlap content
      const footer = document.querySelector('.page__footer');
      if (footer) {
        footer.style.position = 'relative';
        footer.style.marginTop = '3rem';
      }
      
      // Fix sidebar on mobile
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.style.position = 'relative';
        sidebar.style.marginBottom = '2rem';
      }
    }
  }
  
  // Page load animation
  initPageLoadAnimation() {
    const loadingBar = document.createElement('div');
    loadingBar.className = 'page-loading';
    document.body.appendChild(loadingBar);
    
    setTimeout(() => loadingBar.remove(), 600);
    
    const elements = document.querySelectorAll('.page__content > *, .archive__item, .pub-entry');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, Math.min(index * 50, 500));
    });
  }
  
  // Typewriter effect
  initTypewriterEffect() {
    const authorName = document.querySelector('.author__name');
    if (authorName && !authorName.dataset.typed) {
      const text = authorName.textContent;
      authorName.textContent = '';
      authorName.dataset.typed = 'true';
      
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
  }
  
  // Scroll animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          if (entry.target.classList.contains('stat-number')) {
            this.animateNumber(entry.target);
          }
          
          if (entry.target.classList.contains('skill-bar')) {
            this.animateSkillBar(entry.target);
          }
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.archive__item, .pub-entry, .page__content > p, .page__content > div').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Animated stats
  initAnimatedStats() {
    // Add animated counters for any statistics on the page
    const stats = document.querySelectorAll('[data-count]');
    stats.forEach(stat => {
      stat.classList.add('stat-number');
      const target = parseInt(stat.dataset.count);
      stat.textContent = '0';
      stat.dataset.target = target;
    });
  }
  
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
    if (!this.isMobile) {
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
    }
    
    // Ripple effect
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
  
  // CV Popup
  initCVPopup() {
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
    
    const cvLinks = document.querySelectorAll('a[href*="/cv"], a[href*="CV"]');
    const modal = document.querySelector('.cv-modal');
    
    cvLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
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
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Cursor trail (desktop only)
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
    
    document.addEventListener('mouseleave', () => {
      trail.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      trail.style.opacity = '1';
    });
  }
  
  // Smooth scroll
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
  
  // Parallax
  initParallaxElements() {
    if (!this.isMobile) {
      const parallaxElements = document.querySelectorAll('.author__avatar img, .page__hero img');
      
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
          const rate = scrolled * -0.5;
          el.style.transform = `translateY(${rate}px)`;
        });
      });
    }
  }
  
  // Reading progress
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
      const percent = Math.max(0, Math.min((scrolled / docHeight) * 100, 100));
      
      progress.style.width = percent + '%';
    });
  }
  
  // Page transitions
  initPageTransitions() {
    document.querySelectorAll('a').forEach(link => {
      if (link.hostname === window.location.hostname && !link.hash) {
        link.addEventListener('click', (e) => {
          const href = link.href;
          if (!href.includes('#') && !href.includes('.pdf')) {
            e.preventDefault();
            document.body.style.opacity = '0';
            setTimeout(() => {
              window.location.href = href;
            }, 300);
          }
        });
      }
    });
  }
  
  // Publication search
  initPublicationSearch() {
    const pubs = document.querySelectorAll('.pub-entry');
    if (pubs.length > 3) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'publication-search';
      searchContainer.innerHTML = `
        <input type="text" placeholder="Search publications..." class="pub-search-input">
        <div class="search-stats"></div>
      `;
      
      const firstPub = pubs[0];
      if (firstPub && firstPub.parentNode) {
        firstPub.parentNode.insertBefore(searchContainer, firstPub);
        
        const searchInput = searchContainer.querySelector('.pub-search-input');
        const searchStats = searchContainer.querySelector('.search-stats');
        
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          let visibleCount = 0;
          
          pubs.forEach(pub => {
            const text = pub.textContent.toLowerCase();
            if (text.includes(query)) {
              pub.style.display = '';
              pub.style.animation = 'fadeInUp 0.5s ease';
              visibleCount++;
            } else {
              pub.style.display = 'none';
            }
          });
          
          searchStats.textContent = query ? `Showing ${visibleCount} of ${pubs.length} publications` : '';
        });
      }
    }
  }
  
  // Smart navigation
  initSmartNavigation() {
    const sections = document.querySelectorAll('.page__content section, .archive');
    const navLinks = document.querySelectorAll('.greedy-nav a');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id') || '';
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
          link.classList.add('active');
        }
      });
    });
  }
  
  // Enhanced research assistant
  enhanceResearchAssistant() {
    // Wait for AI assistant to load
    setTimeout(() => {
      const aiBtn = document.querySelector('#ai-assistant-btn');
      if (aiBtn) {
        // Make button larger on desktop
        if (!this.isMobile) {
          aiBtn.style.width = '70px';
          aiBtn.style.height = '70px';
          aiBtn.style.fontSize = '32px';
        }
      }
      
      // Enhance chat interface
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const chatInterface = document.querySelector('#ai-chat-interface');
            if (chatInterface) {
              this.enhanceChatInterface(chatInterface);
              observer.disconnect();
            }
          }
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
  }
  
  enhanceChatInterface(chatInterface) {
    // Make chat interface larger and more modern
    chatInterface.style.cssText += `
      width: ${this.isMobile ? '95%' : '600px'};
      height: ${this.isMobile ? '85vh' : '700px'};
      max-width: 95vw;
      max-height: 90vh;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    `;
    
    // Style the header
    const header = chatInterface.querySelector('.chat-header');
    if (header) {
      header.style.cssText += `
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        padding: 1.5rem;
        font-weight: 600;
        font-size: 1.1rem;
      `;
    }
    
    // Style messages
    const messages = chatInterface.querySelectorAll('.message');
    messages.forEach(msg => {
      msg.style.cssText += `
        margin: 0.5rem;
        padding: 1rem;
        border-radius: 12px;
        animation: fadeInUp 0.3s ease;
      `;
    });
    
    // Style input area
    const inputArea = chatInterface.querySelector('.chat-input-container');
    if (inputArea) {
      inputArea.style.cssText += `
        border-top: 1px solid #e2e8f0;
        padding: 1rem;
        background: #f8fafc;
      `;
      
      const input = inputArea.querySelector('input, textarea');
      if (input) {
        input.style.cssText += `
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          padding: 0.75rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        `;
        
        input.addEventListener('focus', () => {
          input.style.borderColor = '#3b82f6';
        });
        
        input.addEventListener('blur', () => {
          input.style.borderColor = '#e2e8f0';
        });
      }
    }
  }
  
  // Interactive background pattern
  initInteractiveBackground() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.03;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // Grid of dots
    const dots = [];
    const dotSize = 2;
    const spacing = 50;
    
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        dots.push({ x, y, baseX: x, baseY: y });
      }
    }
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach(dot => {
        const distance = Math.hypot(dot.x - mouseX, dot.y - mouseY);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 20;
          const angle = Math.atan2(dot.y - mouseY, dot.x - mouseX);
          
          dot.x = dot.baseX + Math.cos(angle) * force;
          dot.y = dot.baseY + Math.sin(angle) * force;
        } else {
          dot.x += (dot.baseX - dot.x) * 0.1;
          dot.y += (dot.baseY - dot.y) * 0.1;
        }
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  // Tooltips for links
  initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: #1e293b;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 9999;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    document.body.appendChild(tooltip);
    
    document.querySelectorAll('a[title], [data-tooltip]').forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const text = e.target.getAttribute('title') || e.target.dataset.tooltip;
        if (text) {
          tooltip.textContent = text;
          tooltip.style.opacity = '1';
          
          const rect = e.target.getBoundingClientRect();
          tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
          tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        }
      });
      
      el.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    });
  }
  
  // Fix text visibility
  fixTextVisibility() {
    const pageContent = document.querySelector('.page__content');
    if (pageContent) {
      pageContent.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.opacity === '0' || computed.visibility === 'hidden') {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        }
      });
      
      const homeContent = pageContent.querySelector('div[style]');
      if (homeContent) {
        homeContent.style.opacity = '1';
        homeContent.style.visibility = 'visible';
        
        homeContent.querySelectorAll('p').forEach(p => {
          p.style.opacity = '1';
          p.style.visibility = 'visible';
        });
      }
    }
  }
}

// Add CSS
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
  
  .animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .publication-search {
    margin-bottom: 2rem;
  }
  
  .pub-search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
  }
  
  .pub-search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .search-stats {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #64748b;
  }
  
  /* Mobile specific fixes */
  @media (max-width: 768px) {
    body {
      padding-bottom: 4rem !important;
    }
    
    .page__content {
      padding-bottom: 3rem !important;
      margin-bottom: 2rem !important;
    }
    
    .archive {
      padding-bottom: 3rem !important;
    }
    
    .page__footer {
      position: relative !important;
      margin-top: 3rem !important;
    }
  }
`;
document.head.appendChild(style);

// Initialize
new EnhancedEffects();