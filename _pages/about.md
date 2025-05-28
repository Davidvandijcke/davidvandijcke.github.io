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
    <span>Please find my <a href="https://davidvandijcke.github.io/cv">CV</a> here.</span>
  </p>
</div> 


<sup></sup>To make sure I was well-prepared for a career in economics, I got a BA in theatre. You can find the evidence [here](https://davidvandijcke.github.io/performing-arts). <sup></sup>

<!-- AI Assistant Button -->
<div id="ai-assistant-container" style="position: fixed; bottom: 30px; right: 30px; z-index: 1000;">
  <button id="ai-assistant-btn" class="btn btn--primary" style="border-radius: 50px; padding: 1rem 1.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; gap: 0.5rem;">
    <i class="fas fa-robot"></i>
    <span>Ask about my research</span>
  </button>
</div>

<!-- AI Assistant Chat Interface -->
<div id="ai-chat-interface" style="display: none; position: fixed; bottom: 100px; right: 30px; width: 400px; height: 500px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); z-index: 1001; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 1rem; display: flex; justify-content: between; align-items: center;">
    <h3 style="margin: 0; font-size: 1.1rem;">Research Assistant</h3>
    <button id="close-chat" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">&times;</button>
  </div>
  <div id="chat-messages" style="height: 380px; overflow-y: auto; padding: 1rem; background: #f8fafc;">
    <div class="assistant-message" style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <p style="margin: 0; color: #475569;">Hi! I'm an AI assistant trained on David Van Dijcke's research and publications. Ask me about his work on econometric methods, causal inference, or any of his papers!</p>
    </div>
  </div>
  <div style="padding: 1rem; border-top: 1px solid #e2e8f0;">
    <form id="chat-form" style="display: flex; gap: 0.5rem;">
      <input type="text" id="user-input" placeholder="Ask about my research..." style="flex: 1; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
      <button type="submit" class="btn btn--primary" style="padding: 0.75rem 1rem; border-radius: 8px;">Send</button>
    </form>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const assistantBtn = document.getElementById('ai-assistant-btn');
  const chatInterface = document.getElementById('ai-chat-interface');
  const closeChat = document.getElementById('close-chat');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  
  assistantBtn.addEventListener('click', function() {
    chatInterface.style.display = 'block';
    assistantBtn.style.display = 'none';
  });
  
  closeChat.addEventListener('click', function() {
    chatInterface.style.display = 'none';
    assistantBtn.style.display = 'flex';
  });
  
  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.style.cssText = 'background: #e0e7ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: right;';
    userMessageDiv.innerHTML = `<p style="margin: 0; color: #1e40af;">${message}</p>`;
    chatMessages.appendChild(userMessageDiv);
    
    userInput.value = '';
    
    // Add loading message
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'assistant-message';
    loadingDiv.style.cssText = 'background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);';
    loadingDiv.innerHTML = '<p style="margin: 0; color: #475569;">Thinking...</p>';
    chatMessages.appendChild(loadingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Note: This is a placeholder - the actual API endpoint will be created
    // For now, we'll show a placeholder response
  // Replace the placeholder API call with:
    const response = await fetch('https://huggingface.co/spaces/dvdijcke/david-research-assistant/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [message, []]  // message and history
      })
    });

    const data = await response.json();
    const botResponse = data.data[0];
      });
});
</script>
