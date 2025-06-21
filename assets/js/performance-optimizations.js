// Performance Optimizations - Ensure smooth experience

(function() {
  'use strict';
  
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    });
    
    // Convert images to lazy load
    document.querySelectorAll('img').forEach(img => {
      if (img.complete || img.src.includes('data:')) return;
      
      if (!img.closest('.author__avatar') && !img.src.includes('favicon')) {
        const src = img.src;
        img.dataset.src = src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.style.background = '#f1f5f9';
        imageObserver.observe(img);
      }
    });
  }
  
  // Debounce scroll events
  let scrollTimer;
  const scrollEvents = [];
  
  window.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    
    scrollTimer = setTimeout(() => {
      scrollEvents.forEach(fn => fn());
    }, 16);
  }, { passive: true });
  
  // Register scroll handlers
  window.addScrollListener = function(fn) {
    scrollEvents.push(fn);
  };
  
  // Preload critical fonts
  const preloadFonts = () => {
    const fonts = [
      '/assets/fonts/fa-solid-900.woff2',
      '/assets/fonts/fa-brands-400.woff2'
    ];
    
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };
  
  // Optimize animations on low-end devices
  const checkPerformance = () => {
    let fps = 60;
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = (frames * 1000) / (currentTime - lastTime);
        frames = 0;
        lastTime = currentTime;
        
        // Reduce animations if FPS is low
        if (fps < 30) {
          document.body.classList.add('reduce-motion');
          
          // Add styles for reduced motion
          const style = document.createElement('style');
          style.textContent = `
            .reduce-motion * {
              animation-duration: 0.01s !important;
              transition-duration: 0.01s !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
      
      if (frames < 60) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
  };
  
  // Prefetch pages on hover
  const prefetchPages = () => {
    const prefetched = new Set();
    
    document.querySelectorAll('a').forEach(link => {
      if (link.hostname === window.location.hostname && 
          !link.href.includes('#') && 
          !link.href.includes('.pdf')) {
        
        link.addEventListener('mouseenter', () => {
          if (!prefetched.has(link.href)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            document.head.appendChild(prefetchLink);
            prefetched.add(link.href);
          }
        }, { passive: true });
      }
    });
  };
  
  // Initialize optimizations
  window.addEventListener('load', () => {
    preloadFonts();
    checkPerformance();
    prefetchPages();
    
    // Remove loading classes
    document.body.classList.add('loaded');
    
    // Clean up unused styles
    setTimeout(() => {
      // Remove unused CSS
      document.querySelectorAll('style').forEach(style => {
        if (style.textContent.includes('debug-fix') || 
            style.textContent.includes('nuclear-fix')) {
          style.remove();
        }
      });
    }, 5000);
  });
  
  // Service worker for offline support (optional)
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    // Register service worker later
    window.addEventListener('load', () => {
      // Uncomment to enable:
      // navigator.serviceWorker.register('/sw.js');
    });
  }
})();