// Ultimate Fixes - Final solutions for CV zoom and Gradio interface

class UltimateFixes {
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
    this.fixCVZoom();
    this.enhanceGradioInterface();
  }
  
  // Fix CV zoom with embedded viewer
  fixCVZoom() {
    // Override all CV links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="/cv"], a[href*="CV"]');
      if (!link) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // Remove any existing modal
      const existingModal = document.querySelector('.cv-modal');
      if (existingModal) existingModal.remove();
      
      // Create new modal with embedded PDF viewer
      const modal = document.createElement('div');
      modal.className = 'cv-modal active';
      modal.innerHTML = `
        <div class="cv-content">
          <div class="cv-header">
            <h2>Curriculum Vitae</h2>
            <div class="cv-controls">
              <button class="cv-zoom-in" title="Zoom In">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v8m4-4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button class="cv-zoom-out" title="Zoom Out">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 11h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button class="cv-zoom-fit" title="Fit Width">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6" width="16" height="12" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 10h8m-8 4h8" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <button class="close-cv" title="Close">×</button>
            </div>
          </div>
          <div class="cv-body">
            <embed src="/files/CV_DavidVanDijcke.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=150" 
                   type="application/pdf" 
                   width="100%" 
                   height="100%">
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      
      // Get the embed element
      const embed = modal.querySelector('embed');
      let currentZoom = 150;
      
      // Zoom controls
      modal.querySelector('.cv-zoom-in').addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 25, 300);
        embed.src = `/files/CV_DavidVanDijcke.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=${currentZoom}`;
      });
      
      modal.querySelector('.cv-zoom-out').addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 25, 50);
        embed.src = `/files/CV_DavidVanDijcke.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=${currentZoom}`;
      });
      
      modal.querySelector('.cv-zoom-fit').addEventListener('click', () => {
        currentZoom = 150;
        embed.src = '/files/CV_DavidVanDijcke.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=150';
      });
      
      // Close handlers
      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
      };
      
      modal.querySelector('.close-cv').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      
      // ESC key
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  }
  
  // Enhance Gradio interface styling
  enhanceGradioInterface() {
    // Monitor for the research assistant modal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const modal = document.querySelector('.ai-modal, #aiModal');
          if (modal && modal.style.display !== 'none') {
            setTimeout(() => this.styleGradioInterface(modal), 500);
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  }
  
  styleGradioInterface(modal) {
    const iframe = modal.querySelector('iframe');
    if (!iframe) return;
    
    // Try to inject styles into the iframe
    iframe.onload = () => {
      try {
        // If same-origin, we can access the iframe content
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Create comprehensive Gradio styling
        const style = iframeDoc.createElement('style');
        style.textContent = `
          /* Hide Gradio branding and clean up interface */
          .gradio-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          
          footer, .footer, [class*="footer"] {
            display: none !important;
          }
          
          /* Style the main container */
          .app, .main, .container {
            padding: 1rem !important;
            background: #ffffff !important;
          }
          
          /* Style input area */
          .input-container, [class*="textbox"] textarea, input[type="text"] {
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            padding: 0.875rem !important;
            font-size: 1rem !important;
            background: #f8fafc !important;
            transition: all 0.2s ease !important;
          }
          
          .input-container:focus-within, [class*="textbox"] textarea:focus, input[type="text"]:focus {
            border-color: #2563eb !important;
            background: white !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
          }
          
          /* Style buttons */
          button, .button, [type="button"] {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
            color: white !important;
            border: none !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 10px !important;
            font-weight: 600 !important;
            font-size: 0.95rem !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }
          
          button:hover, .button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3) !important;
          }
          
          /* Style chat messages */
          .message, .chat-message, [class*="message"] {
            margin: 0.75rem 0 !important;
            padding: 1rem !important;
            border-radius: 12px !important;
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
          }
          
          .user-message, [class*="user"] {
            background: #2563eb !important;
            color: white !important;
            margin-left: 20% !important;
            border-bottom-right-radius: 4px !important;
          }
          
          .bot-message, [class*="bot"], [class*="assistant"] {
            background: #f1f5f9 !important;
            color: #1e293b !important;
            margin-right: 20% !important;
            border-bottom-left-radius: 4px !important;
          }
          
          /* Clean up spacing */
          .gap, .spacing {
            gap: 0.75rem !important;
          }
          
          /* Hide unnecessary elements */
          .share-button, .flag-button, .duplicate-button {
            display: none !important;
          }
          
          /* Improve typography */
          p, span, div {
            line-height: 1.6 !important;
          }
          
          /* Style loading states */
          .loading, [class*="progress"] {
            color: #2563eb !important;
          }
          
          /* Make scrollbar prettier */
          ::-webkit-scrollbar {
            width: 8px !important;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1 !important;
            border-radius: 4px !important;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8 !important;
          }
        `;
        iframeDoc.head.appendChild(style);
        
        // Also try to modify the chat interface dynamically
        const modifyChat = () => {
          // Find and style chat elements
          const messages = iframeDoc.querySelectorAll('[class*="message"], .prose');
          messages.forEach(msg => {
            msg.style.maxWidth = '100%';
            msg.style.wordWrap = 'break-word';
          });
          
          // Find and enhance input
          const inputs = iframeDoc.querySelectorAll('textarea, input[type="text"]');
          inputs.forEach(input => {
            input.style.fontFamily = 'inherit';
            input.style.fontSize = '1rem';
          });
        };
        
        // Run modifications
        modifyChat();
        
        // Watch for changes
        const chatObserver = new MutationObserver(modifyChat);
        chatObserver.observe(iframeDoc.body, { childList: true, subtree: true });
        
      } catch (e) {
        // If cross-origin, we can't access iframe content directly
        console.log('Cannot access iframe content due to cross-origin restrictions');
        
        // At least style the modal itself
        modal.style.cssText += `
          border-radius: 24px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        `;
      }
    };
  }
}

// Add CV modal styles
const style = document.createElement('style');
style.textContent = `
  /* Enhanced CV Modal */
  .cv-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .cv-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
  }
  
  .cv-content {
    width: 95%;
    max-width: 1600px;
    height: 90vh;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    transition: transform 0.3s ease;
  }
  
  .cv-modal.active .cv-content {
    transform: scale(1);
  }
  
  .cv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 20px 20px 0 0;
  }
  
  .cv-header h2 {
    margin: 0;
    color: #0f172a;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .cv-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .cv-controls button {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #475569;
  }
  
  .cv-controls button:hover {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
    transform: translateY(-2px);
  }
  
  .close-cv {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }
  
  .cv-body {
    flex: 1;
    padding: 0;
    overflow: hidden;
    background: #f8fafc;
    border-radius: 0 0 20px 20px;
  }
  
  .cv-body embed {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    .cv-content {
      width: 95%;
      height: 85vh;
    }
    
    .cv-controls button {
      width: 36px;
      height: 36px;
    }
  }
`;
document.head.appendChild(style);

// Initialize ultimate fixes
new UltimateFixes();