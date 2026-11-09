// Debug script to identify and fix any remaining issues
document.addEventListener('DOMContentLoaded', function() {
  console.log('Debug fix script loaded');
  
  // Check if main content is visible
  const pageContent = document.querySelector('.page__content');
  if (pageContent) {
    const hasContent = pageContent.textContent.trim().length > 0;
    console.log('Page content found:', hasContent ? 'Has content' : 'Empty');
    
    if (!hasContent) {
      console.warn('Page content appears empty, checking for hidden elements...');
      
      // Look for any hidden elements
      const hiddenElements = pageContent.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], [style*="opacity: 0"]');
      if (hiddenElements.length > 0) {
        console.log(`Found ${hiddenElements.length} hidden elements, making them visible...`);
        hiddenElements.forEach(el => {
          el.style.display = '';
          el.style.visibility = '';
          el.style.opacity = '';
        });
      }
    }
  }
  
  // Check layout structure
  const layoutSingle = document.querySelector('.layout--single');
  const sidebar = document.querySelector('.sidebar');
  const archive = document.querySelector('.archive');
  
  console.log('Layout check:', {
    layoutSingle: !!layoutSingle,
    sidebar: !!sidebar,
    archive: !!archive
  });
  
  // Check for overlapping elements
  if (archive) {
    const items = archive.querySelectorAll('.archive__item, .pub-entry');
    let overlaps = 0;
    
    items.forEach((item, index) => {
      if (index < items.length - 1) {
        const rect1 = item.getBoundingClientRect();
        const rect2 = items[index + 1].getBoundingClientRect();
        
        if (rect1.bottom > rect2.top) {
          overlaps++;
          console.warn(`Overlap detected between items ${index} and ${index + 1}`);
        }
      }
    });
    
    if (overlaps > 0) {
      console.warn(`Found ${overlaps} overlapping elements`);
    } else {
      console.log('No overlapping elements detected');
    }
  }
  
  // Check text contrast
  const checkContrast = (element) => {
    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;
    
    if (bgColor === color || (bgColor.includes('0, 0, 0') && color.includes('0, 0, 0'))) {
      console.warn('Low contrast detected:', element, { background: bgColor, text: color });
      return false;
    }
    return true;
  };
  
  // Check various text elements
  const textElements = document.querySelectorAll('p, li, span, h1, h2, h3, h4, h5, h6');
  let lowContrastCount = 0;
  
  textElements.forEach(el => {
    if (!checkContrast(el)) {
      lowContrastCount++;
    }
  });
  
  if (lowContrastCount > 0) {
    console.warn(`Found ${lowContrastCount} elements with low contrast`);
  } else {
    console.log('Text contrast appears good');
  }
  
  // Report overall status
  console.log('Debug check complete. Check console for any warnings.');
});