// Critical Fixes - Fix research assistant button and mobile follow button

class CriticalFixes {
  constructor() {
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
    this.enhanceResearchAssistantButton();
    this.fixMobileFollowButtonProperly();
  }
  
  // Enhance the research assistant button
  enhanceResearchAssistantButton() {
    // Wait for button to exist
    const checkButton = setInterval(() => {
      const aiButton = document.querySelector('.ai-button, #aiButton');
      
      if (aiButton) {
        clearInterval(checkButton);
        
        // Override styles to make it bigger and sleeker
        aiButton.style.cssText = `
          position: fixed !important;
          bottom: 30px !important;
          right: 30px !important;
          width: 85px !important;
          height: 85px !important;
          padding: 0 !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
          border: 3px solid rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-direction: column !important;
          gap: 4px !important;
          cursor: pointer !important;
          z-index: 9999 !important;
          transition: all 0.3s ease !important;
          animation: float 3s ease-in-out infinite !important;
        `;
        
        // Update the content - just icon, no text
        const svg = aiButton.querySelector('svg');
        if (svg) {
          svg.style.cssText = `
            width: 36px !important;
            height: 36px !important;
            color: white !important;
          `;
        }
        
        // Remove text, keep only icon
        const textNode = Array.from(aiButton.childNodes).find(node => node.nodeType === 3);
        if (textNode) {
          textNode.remove();
        }
        
        // Add tooltip
        aiButton.title = 'Ask about my research';
        
        // Enhanced hover effect
        aiButton.addEventListener('mouseenter', () => {
          aiButton.style.transform = 'scale(1.1) rotate(5deg)';
          aiButton.style.boxShadow = '0 15px 40px rgba(124, 58, 237, 0.5)';
        });
        
        aiButton.addEventListener('mouseleave', () => {
          aiButton.style.transform = 'scale(1) rotate(0deg)';
          aiButton.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.4)';
        });
        
        // Also enhance the modal
        this.enhanceResearchModal();
      }
    }, 100);
  }
  
  enhanceResearchModal() {
    const modal = document.querySelector('.ai-modal, #aiModal');
    if (modal) {
      modal.style.cssText += `
        width: 500px !important;
        height: 700px !important;
        border-radius: 24px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        overflow: hidden !important;
        right: 30px !important;
        bottom: 130px !important;
      `;
      
      const header = modal.querySelector('.ai-modal-header');
      if (header) {
        header.style.cssText += `
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
          padding: 1.25rem 1.5rem !important;
          font-size: 1.125rem !important;
        `;
      }
      
      // Update iframe styles
      const iframe = modal.querySelector('iframe');
      if (iframe) {
        iframe.style.cssText += `
          border-radius: 0 !important;
        `;
      }
    }
  }
  
  // Fix mobile follow button with a different approach
  fixMobileFollowButtonProperly() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    
    // Wait a bit for all scripts to load
    setTimeout(() => {
      const followBtn = document.querySelector('.author__urls-wrapper button');
      const socialUrls = document.querySelector('.author__urls');
      
      if (followBtn && socialUrls) {
        console.log('Fixing mobile follow button...');
        
        // Remove all existing event listeners by cloning
        const newBtn = followBtn.cloneNode(true);
        followBtn.parentNode.replaceChild(newBtn, followBtn);
        
        // Ensure social URLs has proper initial styles
        socialUrls.style.cssText = `
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          padding: 1rem;
          z-index: 1000;
          list-style: none;
        `;
        
        // Simple toggle function
        let isOpen = false;
        
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          isOpen = !isOpen;
          
          if (isOpen) {
            socialUrls.style.display = 'block';
            newBtn.classList.add('open');
            newBtn.setAttribute('aria-expanded', 'true');
            
            // Ensure it's visible
            setTimeout(() => {
              socialUrls.style.opacity = '1';
            }, 10);
          } else {
            socialUrls.style.display = 'none';
            newBtn.classList.remove('open');
            newBtn.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.author__urls-wrapper') && isOpen) {
            isOpen = false;
            socialUrls.style.display = 'none';
            newBtn.classList.remove('open');
            newBtn.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Style the social icons properly
        const socialIcons = socialUrls.querySelectorAll('li');
        socialIcons.forEach(icon => {
          icon.style.cssText = `
            margin-bottom: 0.75rem;
            list-style: none;
          `;
          
          const link = icon.querySelector('a');
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
            `;
            
            link.addEventListener('click', (e) => {
              e.stopPropagation();
            });
            
            link.addEventListener('touchstart', () => {
              link.style.background = '#e2e8f0';
            });
            
            link.addEventListener('touchend', () => {
              link.style.background = '#f8fafc';
            });
          }
        });
        
        // Fix button styles
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
          transition: all 0.2s ease;
        `;
        
        // Add arrow indicator
        if (!newBtn.querySelector('.arrow')) {
          const arrow = document.createElement('span');
          arrow.className = 'arrow';
          arrow.textContent = ' ▼';
          arrow.style.cssText = `
            display: inline-block;
            margin-left: 0.5rem;
            transition: transform 0.2s ease;
          `;
          newBtn.appendChild(arrow);
        }
        
        // Rotate arrow when open
        const updateArrow = () => {
          const arrow = newBtn.querySelector('.arrow');
          if (arrow) {
            arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        };
        
        // Update arrow on click
        newBtn.addEventListener('click', updateArrow);
      }
    }, 1000);
  }
}

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
  /* Mobile follow button fixes */
  @media (max-width: 768px) {
    .author__urls-wrapper {
      position: relative !important;
      margin-top: 1rem !important;
    }
    
    .author__urls {
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
    }
    
    .author__urls.social-icons li a {
      gap: 0.75rem !important;
    }
    
    .author__urls.social-icons li a i,
    .author__urls.social-icons li a svg {
      width: 20px !important;
      flex-shrink: 0 !important;
    }
  }
  
  /* Research assistant button pulse effect */
  @keyframes pulse {
    0% {
      box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
    }
    50% {
      box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4), 0 0 0 15px rgba(124, 58, 237, 0.1);
    }
    100% {
      box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4), 0 0 0 0 rgba(124, 58, 237, 0);
    }
  }
  
  .ai-button {
    animation: float 3s ease-in-out infinite, pulse 2s ease-out infinite !important;
  }
`;
document.head.appendChild(style);

// Initialize critical fixes
new CriticalFixes();