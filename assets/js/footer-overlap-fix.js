// Fix footer overlap with social media links on desktop
(function() {
  'use strict';
  
  // Only run on desktop
  if (window.innerWidth <= 768) return;
  
  // Add styles to prevent footer overlap
  const style = document.createElement('style');
  style.textContent = `
    /* Ensure proper spacing on desktop */
    @media (min-width: 769px) {
      /* Add bottom padding to the sidebar */
      .sidebar {
        padding-bottom: 100px !important;
      }
      
      /* Ensure author profile has proper spacing */
      .author__content {
        margin-bottom: 1rem !important;
      }
      
      /* Add margin to the author URLs wrapper */
      .author__urls-wrapper {
        margin-bottom: 2rem !important;
      }
      
      /* Ensure the page has minimum height */
      .page {
        min-height: calc(100vh - 200px) !important;
        padding-bottom: 100px !important;
      }
      
      /* Make sure footer stays at bottom */
      .page__footer {
        position: relative !important;
        margin-top: 3rem !important;
        clear: both !important;
      }
      
      /* Add spacing to the main content area */
      #main {
        margin-bottom: 100px !important;
      }
      
      /* Ensure social icons don't overflow */
      .author__urls.social-icons {
        max-height: calc(100vh - 400px) !important;
        overflow-y: auto !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Also add a resize handler to recalculate on window resize
  function checkOverlap() {
    const socialIcons = document.querySelector('.author__urls.social-icons');
    const footer = document.querySelector('.page__footer');
    
    if (socialIcons && footer) {
      const socialRect = socialIcons.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      
      // If overlapping, add more margin
      if (socialRect.bottom > footerRect.top) {
        socialIcons.style.marginBottom = '100px';
      }
    }
  }
  
  // Check on load and resize
  window.addEventListener('load', checkOverlap);
  window.addEventListener('resize', checkOverlap);
})();