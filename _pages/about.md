---
permalink: /
title: ""
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
header:
  overlay_image: /umich.jpg
  overlay_filter: 0.5 # same as adding an opacity of 0.5 to a black background
---

Welcome to my webpage. 

<div style="margin: 1.5rem 0;">
  <p style="display: flex; align-items: flex-start; margin-bottom: 1rem;">
    <img src="/images/favicon.ico" alt="drawing" width="20" style="margin-right: 0.75rem; margin-top: 0.25rem; flex-shrink: 0;"/> 
    <span>I am a PhD student in Economics at the University of Michigan (Ann Arbor). I am on the job market for the 2025-26 academic year.</span>
  </p>

  <p style="display: flex; align-items: flex-start; margin-bottom: 1rem;">
    <img src="/images/favicon.ico" alt="drawing" width="20" style="margin-right: 0.75rem; margin-top: 0.25rem; flex-shrink: 0;"/> 
    <span>I am a Rackham Graduate School Predoctoral <a href="https://rackham.umich.edu/predoctoral-fellowship-celebration/social-sciences/#David-Van-Dijcke">Fellow</a> at the University of Michigan in 2024-25. I am also an Academic Visitor at the <a href="https://www.bankofengland.co.uk/">Bank of England</a>.</span>
  </p>

  <p style="display: flex; align-items: flex-start; margin-bottom: 1rem;">
    <img src="/images/favicon.ico" alt="drawing" width="20" style="margin-right: 0.75rem; margin-top: 0.25rem; flex-shrink: 0;"/> 
    <span>My <a href="https://davidvandijcke.com/research">research</a> develops novel econometric methods combining causal inference with functional data analysis and optimal transport to study settings where the outcomes and/or covariates are functional and high-dimensional. I have implemented these methods to study questions ranging from evaluating labor market policies to understanding mobility patterns in response to crises.</span>
  </p>

  <p style="display: flex; align-items: flex-start; margin-bottom: 1rem;">
    <img src="/images/favicon.ico" alt="drawing" width="20" style="margin-right: 0.75rem; margin-top: 0.25rem; flex-shrink: 0;"/> 
    <span>You can book a meeting with me via <a href="https://calendar.app.google/dKeDaigmFwnJPm8s6">this link</a>.</span>
  </p>

  <p style="display: flex; align-items: flex-start; margin-bottom: 1rem;">
    <img src="/images/favicon.ico" alt="drawing" width="20" style="margin-right: 0.75rem; margin-top: 0.25rem; flex-shrink: 0;"/> 
    <span>Please find my <a href="https://davidvandijcke.com/cv">CV</a> here.</span>
  </p>
</div> 


<sup></sup>To make sure I was well-prepared for a career in economics, I got a BA in theatre. You can find the evidence [here](https://davidvandijcke.com/performing-arts). <sup></sup>

<!-- AI Assistant Button -->
<div id="ai-assistant-container" style="position: fixed !important; bottom: 20px !important; right: 30px !important; z-index: 99999 !important; display: block !important; visibility: visible !important; opacity: 1 !important; animation: none !important;">
  <button id="ai-assistant-btn" class="btn btn--primary" style="border-radius: 50px; padding: 1rem 1.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex !important; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); border: none; color: white; cursor: pointer; transition: transform 0.2s; visibility: visible !important; opacity: 1 !important; animation: none !important;">
    <i class="fas fa-robot"></i>
    <span>Ask about my research</span>
  </button>
</div>

<!-- AI Assistant Chat Interface -->
<div id="ai-chat-interface" style="display: none; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); overflow: hidden;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
    <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">David's Research Assistant</h3>
    <button id="close-chat" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">&times;</button>
  </div>
  <iframe
    src="https://dvdijcke-david-research-assistant.hf.space"
    frameborder="0"
    width="100%"
    height="calc(100% - 60px)"
    style="display: block;"
  ></iframe>
</div>

<script>
// Prevent animations from affecting AI assistant
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    #ai-assistant-container,
    #ai-assistant-container *,
    #ai-chat-interface,
    #ai-chat-interface * {
      animation: none !important;
      animation-delay: 0s !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
});

// Ensure button stays visible
window.addEventListener('load', function() {
  // Force show the AI assistant button after page fully loads
  setTimeout(function() {
    const container = document.getElementById('ai-assistant-container');
    const assistantBtn = document.getElementById('ai-assistant-btn');
    const chatInterface = document.getElementById('ai-chat-interface');
    const closeChat = document.getElementById('close-chat');
    
    if (container) {
      container.style.cssText = 'position: fixed !important; bottom: 20px !important; right: 30px !important; z-index: 99999 !important; display: block !important; visibility: visible !important; opacity: 1 !important; animation: none !important;';
    }
    
    if (assistantBtn) {
      assistantBtn.style.cssText = 'border-radius: 50px; padding: 1rem 1.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex !important; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); border: none; color: white; cursor: pointer; transition: transform 0.2s; visibility: visible !important; opacity: 1 !important; animation: none !important;';
      
      // Add hover effect to button
      assistantBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      assistantBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
      
      assistantBtn.addEventListener('click', function() {
        chatInterface.style.display = 'block';
        container.style.display = 'none';
      });
    }
    
    if (closeChat && chatInterface) {
      closeChat.addEventListener('click', function() {
        chatInterface.style.display = 'none';
        container.style.display = 'block';
      });
      
      // Close chat when clicking outside
      document.addEventListener('click', function(event) {
        if (!chatInterface.contains(event.target) && !container.contains(event.target) && chatInterface.style.display === 'block') {
          chatInterface.style.display = 'none';
          container.style.display = 'block';
        }
      });
    }
  }, 100); // Reduced delay to show button faster
  
  // Additional failsafe to ensure button visibility
  setInterval(function() {
    const container = document.getElementById('ai-assistant-container');
    if (container && container.style.display !== 'none' && (!container.style.opacity || container.style.opacity === '0')) {
      container.style.opacity = '1';
      container.style.visibility = 'visible';
    }
  }, 1000);
});
</script>
