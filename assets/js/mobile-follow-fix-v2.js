// Mobile Follow Button Fix V2 - More aggressive approach

(function() {
  'use strict';
  
  // Only run on mobile
  if (window.innerWidth > 768) return;
  
  console.log('Mobile Follow Fix V2 - Starting...');
  
  // Main fix function
  function applyMobileFix() {
    // Find the follow button and menu
    const followBtn = document.querySelector('.author__urls-wrapper button');
    const socialMenu = document.querySelector('.author__urls.social-icons');
    
    if (!followBtn || !socialMenu) {
      console.log('Elements not found, retrying...');
      setTimeout(applyMobileFix, 100);
      return;
    }
    
    console.log('Found follow button and menu, applying fix...');
    
    // Remove ALL existing event listeners by cloning
    const newBtn = followBtn.cloneNode(true);
    followBtn.parentNode.replaceChild(newBtn, followBtn);
    
    // Ensure proper initial state
    socialMenu.style.display = 'none';
    socialMenu.classList.remove('is--visible');
    newBtn.setAttribute('aria-expanded', 'false');
    
    // Apply essential styles directly
    newBtn.style.cssText = `
      background: #2563eb !important;
      color: white !important;
      border: none !important;
      padding: 0.75rem 1.5rem !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      width: 100% !important;
      text-align: center !important;
      position: relative !important;
      z-index: 999 !important;
      -webkit-tap-highlight-color: transparent !important;
      touch-action: manipulation !important;
    `;
    
    // Style the menu
    socialMenu.style.cssText = `
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      right: 0 !important;
      margin-top: 8px !important;
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
      padding: 1rem !important;
      z-index: 9999 !important;
      list-style: none !important;
    `;
    
    // Ensure wrapper is positioned
    const wrapper = document.querySelector('.author__urls-wrapper');
    if (wrapper) {
      wrapper.style.position = 'relative';
      wrapper.style.zIndex = '998';
    }
    
    // Simple toggle state
    let isOpen = false;
    
    // Toggle function
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      
      isOpen = !isOpen;
      
      if (isOpen) {
        socialMenu.style.display = 'block';
        socialMenu.classList.add('is--visible');
        newBtn.setAttribute('aria-expanded', 'true');
        console.log('Menu opened');
      } else {
        socialMenu.style.display = 'none';
        socialMenu.classList.remove('is--visible');
        newBtn.setAttribute('aria-expanded', 'false');
        console.log('Menu closed');
      }
    }
    
    // Add click handler
    newBtn.addEventListener('click', toggleMenu, { passive: false });
    
    // Add touch handler for better mobile response
    newBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      toggleMenu(e);
    }, { passive: false });
    
    // Prevent menu from closing when clicking inside
    socialMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    socialMenu.addEventListener('touchend', function(e) {
      e.stopPropagation();
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (isOpen && !wrapper.contains(e.target)) {
        toggleMenu();
      }
    });
    
    // Style the menu items
    const menuItems = socialMenu.querySelectorAll('li');
    menuItems.forEach(item => {
      item.style.marginBottom = '0.5rem';
      const link = item.querySelector('a');
      if (link) {
        link.style.cssText = `
          display: flex !important;
          align-items: center !important;
          padding: 0.75rem 1rem !important;
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          color: #475569 !important;
          text-decoration: none !important;
          gap: 0.75rem !important;
        `;
      }
    });
    
    // Add override styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @media (max-width: 768px) {
        .author__urls-wrapper {
          position: relative !important;
          z-index: 998 !important;
        }
        
        .author__urls.social-icons {
          display: none !important;
        }
        
        .author__urls.social-icons.is--visible {
          display: block !important;
        }
        
        /* Override any theme styles */
        .author__urls-wrapper button {
          pointer-events: auto !important;
          user-select: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
    
    console.log('Mobile follow fix V2 applied successfully');
  }
  
  // Run the fix with multiple attempts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMobileFix);
  } else {
    // Try immediately and after delays to catch any late-loading elements
    applyMobileFix();
    setTimeout(applyMobileFix, 500);
    setTimeout(applyMobileFix, 1000);
    setTimeout(applyMobileFix, 2000);
  }
})();