// Ultimate Mobile Follow Button Fix
(function() {
  'use strict';
  
  // Wait for page load
  window.addEventListener('load', function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    console.log('Ultimate Mobile Follow Fix - Starting...');
    
    // Fix function
    function fixMobileFollow() {
      // Get button using exact class
      const btn = document.querySelector('.author__urls-wrapper .btn.btn--inverse');
      const menu = document.querySelector('.author__urls.social-icons');
      
      if (!btn || !menu) {
        console.log('Elements not found, retrying...');
        return;
      }
      
      console.log('Found button and menu, fixing...');
      
      // First, remove the button completely and recreate it
      const wrapper = btn.parentElement;
      const newBtn = document.createElement('button');
      newBtn.className = 'btn btn--inverse';
      newBtn.textContent = 'Follow';
      
      // Remove old button
      btn.remove();
      
      // Insert new button
      wrapper.insertBefore(newBtn, menu);
      
      // Hide menu initially
      menu.style.display = 'none';
      
      // Apply mobile-friendly styles
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          /* Position follow button below author info */
          .sidebar__right {
            display: flex !important;
            flex-direction: column !important;
          }
          
          .author__avatar {
            margin-bottom: 1rem !important;
          }
          
          .author__content {
            margin-bottom: 1rem !important;
          }
          
          .author__urls-wrapper {
            position: relative !important;
            width: auto !important;
            display: inline-block !important;
            margin: 0 auto !important;
            text-align: center !important;
          }
          
          .author__urls-wrapper .btn.btn--inverse {
            width: auto !important;
            padding: 0.5rem 1.5rem !important;
            margin: 0 !important;
            background: #7c3aed !important;  /* Purple color */
            color: white !important;
            border: none !important;
            border-radius: 25px !important;  /* Pill shape */
            font-size: 14px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            -webkit-tap-highlight-color: transparent !important;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3) !important;
          }
          
          .author__urls.social-icons {
            position: absolute !important;
            top: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: none;
            width: 200px !important;
            margin-top: 0.5rem !important;
            padding: 0.75rem !important;
            background: white !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            z-index: 1000 !important;
          }
          
          .author__urls.social-icons.show {
            display: block !important;
          }
          
          .author__urls.social-icons li {
            margin-bottom: 0.5rem !important;
          }
          
          .author__urls.social-icons li:last-child {
            margin-bottom: 0 !important;
          }
          
          .author__urls.social-icons a {
            display: flex !important;
            align-items: center !important;
            padding: 0.75rem !important;
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            color: #374151 !important;
            text-decoration: none !important;
            font-size: 15px !important;
          }
          
          .author__urls.social-icons a i {
            margin-right: 0.5rem !important;
            width: 20px !important;
            text-align: center !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Simple toggle
      let isOpen = false;
      
      newBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        isOpen = !isOpen;
        
        if (isOpen) {
          menu.classList.add('show');
          menu.style.display = 'block';
        } else {
          menu.classList.remove('show');
          menu.style.display = 'none';
        }
        
        console.log('Menu toggled:', isOpen ? 'open' : 'closed');
      };
      
      // Prevent menu clicks from closing
      menu.onclick = function(e) {
        e.stopPropagation();
      };
      
      // Close on outside click
      document.addEventListener('click', function(e) {
        if (isOpen && !wrapper.contains(e.target)) {
          isOpen = false;
          menu.classList.remove('show');
          menu.style.display = 'none';
        }
      });
      
      console.log('Mobile follow fix applied successfully!');
    }
    
    // Try immediately and with delay
    fixMobileFollow();
    setTimeout(fixMobileFollow, 100);
    setTimeout(fixMobileFollow, 500);
    setTimeout(fixMobileFollow, 1000);
  });
})();