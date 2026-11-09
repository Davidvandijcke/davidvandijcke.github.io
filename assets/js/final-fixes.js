// Final Fixes - Comprehensive improvements and bug fixes

class FinalFixes {
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
    this.fixMobileFollowButton();
    this.enhanceAIAssistant();
    this.fixFooterOverlap();
    this.enhanceCVModal();
    this.polishDetails();
  }
  
  // Fix mobile follow button
  fixMobileFollowButton() {
    // Wait for other scripts to load
    setTimeout(() => {
      const followBtn = document.querySelector('.author__urls-wrapper button');
      const socialUrls = document.querySelector('.author__urls');
      
      if (followBtn && socialUrls) {
        // Remove any existing handlers
        const newBtn = followBtn.cloneNode(true);
        followBtn.parentNode.replaceChild(newBtn, followBtn);
        
        // Add fixed click handler
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const isOpen = socialUrls.style.display === 'block';
          
          if (isOpen) {
            socialUrls.style.display = 'none';
            newBtn.classList.remove('open');
          } else {
            socialUrls.style.display = 'block';
            newBtn.classList.add('open');
            
            // Fix z-index and positioning
            socialUrls.style.zIndex = '999';
            socialUrls.style.position = 'absolute';
            socialUrls.style.top = '100%';
            socialUrls.style.left = '0';
            socialUrls.style.right = '0';
            socialUrls.style.marginTop = '0.5rem';
            socialUrls.style.background = 'white';
            socialUrls.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            socialUrls.style.borderRadius = '12px';
            socialUrls.style.padding = '1rem';
          }
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.author__urls-wrapper')) {
            socialUrls.style.display = 'none';
            newBtn.classList.remove('open');
          }
        });
      }
    }, 500);
  }
  
  // Enhance AI Assistant button and interface
  enhanceAIAssistant() {
    // Wait for AI assistant to load
    const checkInterval = setInterval(() => {
      const aiBtn = document.querySelector('#ai-assistant-btn');
      
      if (aiBtn) {
        clearInterval(checkInterval);
        
        // Make button larger
        aiBtn.style.cssText += `
          width: 80px !important;
          height: 80px !important;
          font-size: 36px !important;
          bottom: 30px !important;
          right: 30px !important;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
          box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.35) !important;
          transition: all 0.3s ease !important;
        `;
        
        // Add hover effect
        aiBtn.addEventListener('mouseenter', () => {
          aiBtn.style.transform = 'scale(1.1) rotate(5deg)';
          aiBtn.style.boxShadow = '0 15px 35px -5px rgba(124, 58, 237, 0.45)';
        });
        
        aiBtn.addEventListener('mouseleave', () => {
          aiBtn.style.transform = 'scale(1) rotate(0deg)';
          aiBtn.style.boxShadow = '0 10px 25px -5px rgba(124, 58, 237, 0.35)';
        });
        
        // Enhance chat interface when it opens
        this.observeChatInterface();
      }
    }, 100);
  }
  
  observeChatInterface() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const chatInterface = document.querySelector('#ai-chat-interface');
          if (chatInterface && !chatInterface.dataset.enhanced) {
            this.enhanceChatInterface(chatInterface);
            chatInterface.dataset.enhanced = 'true';
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  enhanceChatInterface(chatInterface) {
    // Apply comprehensive styling
    chatInterface.style.cssText += `
      width: 650px !important;
      height: 750px !important;
      max-width: 95vw !important;
      max-height: 90vh !important;
      border-radius: 24px !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      border: none !important;
      overflow: hidden !important;
      background: white !important;
    `;
    
    // Style all internal elements
    setTimeout(() => {
      // Header
      const header = chatInterface.querySelector('.chat-header, [class*="header"]');
      if (header) {
        header.style.cssText += `
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
          color: white !important;
          padding: 1.5rem !important;
          font-weight: 600 !important;
          font-size: 1.125rem !important;
          border-radius: 24px 24px 0 0 !important;
        `;
        
        // Close button
        const closeBtn = header.querySelector('button, [class*="close"]');
        if (closeBtn) {
          closeBtn.style.cssText += `
            color: white !important;
            opacity: 0.9 !important;
            transition: opacity 0.2s !important;
          `;
          closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
          });
          closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.9';
          });
        }
      }
      
      // Messages container
      const messagesContainer = chatInterface.querySelector('.messages, [class*="messages"], .chat-body');
      if (messagesContainer) {
        messagesContainer.style.cssText += `
          background: #f8fafc !important;
          padding: 1.5rem !important;
        `;
        
        // Individual messages
        const messages = messagesContainer.querySelectorAll('.message, [class*="message"]');
        messages.forEach(msg => {
          const isUser = msg.textContent.includes('You:') || msg.classList.contains('user');
          msg.style.cssText += `
            margin: 0.75rem 0 !important;
            padding: 1rem 1.25rem !important;
            border-radius: 16px !important;
            max-width: 80% !important;
            animation: messageSlideIn 0.3s ease !important;
            ${isUser ? `
              background: #2563eb !important;
              color: white !important;
              margin-left: auto !important;
              border-bottom-right-radius: 4px !important;
            ` : `
              background: white !important;
              color: #1e293b !important;
              margin-right: auto !important;
              border-bottom-left-radius: 4px !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
            `}
          `;
        });
      }
      
      // Input area
      const inputContainer = chatInterface.querySelector('.chat-input, [class*="input"], .input-container');
      if (inputContainer) {
        inputContainer.style.cssText += `
          border-top: 1px solid #e2e8f0 !important;
          padding: 1.5rem !important;
          background: white !important;
        `;
        
        const input = inputContainer.querySelector('input, textarea');
        if (input) {
          input.style.cssText += `
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            padding: 0.875rem 1rem !important;
            font-size: 1rem !important;
            transition: all 0.2s ease !important;
            background: #f8fafc !important;
            width: 100% !important;
          `;
          
          input.addEventListener('focus', () => {
            input.style.borderColor = '#2563eb !important';
            input.style.background = 'white !important';
            input.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1) !important';
          });
          
          input.addEventListener('blur', () => {
            input.style.borderColor = '#e2e8f0 !important';
            input.style.background = '#f8fafc !important';
            input.style.boxShadow = 'none !important';
          });
        }
        
        const sendBtn = inputContainer.querySelector('button');
        if (sendBtn) {
          sendBtn.style.cssText += `
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
            color: white !important;
            border: none !important;
            padding: 0.875rem 1.5rem !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
          `;
          
          sendBtn.addEventListener('mouseenter', () => {
            sendBtn.style.transform = 'translateY(-2px)';
            sendBtn.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
          });
          
          sendBtn.addEventListener('mouseleave', () => {
            sendBtn.style.transform = 'translateY(0)';
            sendBtn.style.boxShadow = 'none';
          });
        }
      }
    }, 100);
  }
  
  // Fix footer overlap
  fixFooterOverlap() {
    const style = document.createElement('style');
    style.textContent = `
      /* Fix footer overlap */
      .archive {
        padding-bottom: 4rem !important;
      }
      
      .page__content {
        margin-bottom: 3rem !important;
      }
      
      .pub-entry:last-child,
      .archive__item:last-child {
        margin-bottom: 3rem !important;
      }
      
      /* Ensure footer stays at bottom */
      .page__footer {
        clear: both !important;
        position: relative !important;
        margin-top: 4rem !important;
      }
      
      @keyframes messageSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Enhance CV Modal with auto-zoom
  enhanceCVModal() {
    // Override existing CV popup handler
    setTimeout(() => {
      const cvLinks = document.querySelectorAll('a[href*="/cv"], a[href*="CV"]');
      
      cvLinks.forEach(link => {
        // Remove existing handlers
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Find or create modal
          let modal = document.querySelector('.cv-modal');
          if (!modal) {
            modal = document.createElement('div');
            modal.className = 'cv-modal';
            modal.innerHTML = `
              <div class="cv-content">
                <div class="cv-header">
                  <h2>Curriculum Vitae</h2>
                  <button class="close-cv">×</button>
                </div>
                <div class="cv-body">
                  <iframe src="/files/CV_DavidVanDijcke.pdf#zoom=125"></iframe>
                </div>
              </div>
            `;
            document.body.appendChild(modal);
          }
          
          // Update iframe with zoom parameter
          const iframe = modal.querySelector('iframe');
          if (iframe && !iframe.src.includes('#zoom=')) {
            iframe.src = '/files/CV_DavidVanDijcke.pdf#zoom=125';
          }
          
          // Add custom zoom controls
          const cvBody = modal.querySelector('.cv-body');
          if (!cvBody.querySelector('.zoom-controls')) {
            const zoomControls = document.createElement('div');
            zoomControls.className = 'zoom-controls';
            zoomControls.innerHTML = `
              <button class="zoom-btn zoom-in">+</button>
              <button class="zoom-btn zoom-out">−</button>
              <button class="zoom-btn zoom-fit">Fit</button>
            `;
            zoomControls.style.cssText = `
              position: absolute;
              top: 1rem;
              right: 1rem;
              display: flex;
              gap: 0.5rem;
              z-index: 10;
            `;
            cvBody.appendChild(zoomControls);
            
            // Zoom functionality
            let currentZoom = 125;
            
            zoomControls.querySelector('.zoom-in').addEventListener('click', () => {
              currentZoom = Math.min(currentZoom + 25, 200);
              iframe.src = `/files/CV_DavidVanDijcke.pdf#zoom=${currentZoom}`;
            });
            
            zoomControls.querySelector('.zoom-out').addEventListener('click', () => {
              currentZoom = Math.max(currentZoom - 25, 50);
              iframe.src = `/files/CV_DavidVanDijcke.pdf#zoom=${currentZoom}`;
            });
            
            zoomControls.querySelector('.zoom-fit').addEventListener('click', () => {
              currentZoom = 125;
              iframe.src = `/files/CV_DavidVanDijcke.pdf#zoom=125`;
            });
            
            // Style zoom buttons
            document.querySelectorAll('.zoom-btn').forEach(btn => {
              btn.style.cssText = `
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                width: 36px;
                height: 36px;
                font-size: 1.125rem;
                font-weight: 600;
                color: #475569;
                cursor: pointer;
                transition: all 0.2s ease;
              `;
              
              btn.addEventListener('mouseenter', () => {
                btn.style.background = '#2563eb';
                btn.style.color = 'white';
                btn.style.borderColor = '#2563eb';
              });
              
              btn.addEventListener('mouseleave', () => {
                btn.style.background = 'white';
                btn.style.color = '#475569';
                btn.style.borderColor = '#e2e8f0';
              });
            });
          }
          
          // Show modal
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
          
          // Close handlers
          const closeBtn = modal.querySelector('.close-cv');
          closeBtn.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          };
          
          modal.onclick = (e) => {
            if (e.target === modal) {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            }
          };
        });
      });
    }, 1000);
  }
  
  // Final polish and improvements
  polishDetails() {
    // Add subtle animations to navigation
    document.querySelectorAll('.greedy-nav a').forEach(link => {
      link.style.transition = 'all 0.3s ease';
    });
    
    // Ensure all images have smooth loading
    document.querySelectorAll('img').forEach(img => {
      img.style.transition = 'opacity 0.3s ease';
      if (!img.complete) {
        img.style.opacity = '0';
        img.onload = () => {
          img.style.opacity = '1';
        };
      }
    });
    
    // Add keyboard navigation for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.cv-modal.active, .modal.active').forEach(modal => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });
    
    // Improve focus states
    const style = document.createElement('style');
    style.textContent = `
      /* Better focus states */
      a:focus,
      button:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      
      /* Smooth scrollbar */
      ::-webkit-scrollbar {
        width: 12px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f5f9;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 6px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      
      /* Print styles for CV */
      @media print {
        .cv-header,
        .zoom-controls {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize final fixes
new FinalFixes();