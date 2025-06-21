// Definitive Mobile Follow Button Fix

(function() {
  'use strict';
  
  // Only run on mobile
  if (window.innerWidth > 768) return;
  
  // Wait for DOM and other scripts
  function fixFollowButton() {
    const followBtn = document.querySelector('.author__urls-wrapper button');
    const socialUrls = document.querySelector('.author__urls');
    
    if (!followBtn || !socialUrls) {
      console.log('Mobile follow button elements not found, retrying...');
      setTimeout(fixFollowButton, 500);
      return;
    }
    
    console.log('Applying mobile follow button fix...');
    
    // Remove any existing jQuery handlers by removing and recreating the button
    const btnParent = followBtn.parentNode;
    const newBtn = document.createElement('button');
    newBtn.className = followBtn.className;
    newBtn.innerHTML = followBtn.innerHTML;
    newBtn.setAttribute('aria-expanded', 'false');
    newBtn.setAttribute('aria-label', 'Follow menu');
    btnParent.replaceChild(newBtn, followBtn);
    
    // Style the button
    newBtn.style.cssText = `
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      text-align: center;
      position: relative;
      z-index: 10;
    `;
    
    // Initially hide social URLs with proper styling
    socialUrls.style.cssText = `
      display: none;
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border-radius: 12px;
      padding: 1rem;
      z-index: 1001;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      list-style: none;
      margin: 0;
    `;
    
    // Style parent wrapper
    const wrapper = document.querySelector('.author__urls-wrapper');
    if (wrapper) {
      wrapper.style.position = 'relative';
      wrapper.style.zIndex = '1000';
      wrapper.style.marginTop = '1rem';
    }
    
    // Add arrow to button if not present
    if (!newBtn.querySelector('.follow-arrow')) {
      const arrow = document.createElement('span');
      arrow.className = 'follow-arrow';
      arrow.innerHTML = ' ▼';
      arrow.style.cssText = `
        display: inline-block;
        margin-left: 0.5rem;
        transition: transform 0.2s ease;
        font-size: 0.8em;
      `;
      newBtn.appendChild(arrow);
    }
    
    // Track open state
    let isOpen = false;
    
    // Toggle function
    function toggleMenu() {
      isOpen = !isOpen;
      const arrow = newBtn.querySelector('.follow-arrow');
      
      if (isOpen) {
        // Show menu
        socialUrls.style.display = 'block';
        // Force reflow
        socialUrls.offsetHeight;
        // Animate in
        socialUrls.style.opacity = '1';
        socialUrls.style.transform = 'translateY(0)';
        newBtn.setAttribute('aria-expanded', 'true');
        newBtn.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        // Hide menu
        socialUrls.style.opacity = '0';
        socialUrls.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (!isOpen) socialUrls.style.display = 'none';
        }, 200);
        newBtn.setAttribute('aria-expanded', 'false');
        newBtn.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0)';
      }
    }
    
    // Button click handler
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
    
    // Touch handler for better mobile response
    newBtn.addEventListener('touchstart', function(e) {
      e.stopPropagation();
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (isOpen && !wrapper.contains(e.target)) {
        toggleMenu();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    });
    
    // Style the social icons
    const socialItems = socialUrls.querySelectorAll('li');
    socialItems.forEach((item, index) => {
      item.style.cssText = `
        list-style: none;
        margin: 0 0 0.5rem 0;
        opacity: 0;
        animation: fadeInUp 0.3s ease forwards;
        animation-delay: ${index * 0.05}s;
      `;
      
      if (index === socialItems.length - 1) {
        item.style.marginBottom = '0';
      }
      
      const link = item.querySelector('a');
      if (link) {
        link.style.cssText = `
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #475569;
          text-decoration: none;
          transition: all 0.2s ease;
          gap: 0.75rem;
        `;
        
        // Prevent link clicks from closing menu
        link.addEventListener('click', function(e) {
          e.stopPropagation();
        });
        
        // Touch feedback
        link.addEventListener('touchstart', function() {
          this.style.background = '#e2e8f0';
        });
        
        link.addEventListener('touchend', function() {
          this.style.background = '#f8fafc';
        });
        
        // Style icons
        const icon = link.querySelector('i, svg, .svg-inline--fa');
        if (icon) {
          icon.style.cssText = `
            width: 20px;
            flex-shrink: 0;
            text-align: center;
          `;
        }
      }
    });
    
    // Add animation keyframes
    if (!document.querySelector('#mobile-follow-animations')) {
      const style = document.createElement('style');
      style.id = 'mobile-follow-animations';
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Ensure proper z-index stacking */
        .author__urls-wrapper {
          position: relative !important;
          z-index: 1000 !important;
        }
        
        .author__urls {
          position: absolute !important;
          z-index: 1001 !important;
        }
        
        /* Override any conflicting styles */
        @media (max-width: 768px) {
          .author__urls.social-icons {
            display: none;
            opacity: 0;
          }
          
          .author__urls.social-icons[style*="display: block"] {
            display: block !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log('Mobile follow button fix applied successfully');
  }
  
  // Run fix when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFollowButton);
  } else {
    // Add a small delay to ensure other scripts have run
    setTimeout(fixFollowButton, 1000);
  }
})();