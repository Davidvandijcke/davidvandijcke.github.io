// Enhanced Effects - Minimal, professional utilities only

class EnhancedEffects {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
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
    this.initCVPopup();
    this.initSmoothScroll();
    this.initPublicationSearch();
    this.enhanceResearchAssistant();
    this.fixMobileLayout();
  }

  // Fix mobile layout issues
  fixMobileLayout() {
    if (this.isMobile) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setVH();
      window.addEventListener('resize', setVH);

      const mainContent = document.querySelector('.page__content');
      if (mainContent) {
        mainContent.style.paddingBottom = '4rem';
      }

      const footer = document.querySelector('.page__footer');
      if (footer) {
        footer.style.position = 'relative';
        footer.style.marginTop = '3rem';
      }

      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.style.position = 'relative';
        sidebar.style.marginBottom = '2rem';
      }
    }
  }

  // CV Popup
  initCVPopup() {
    if (!document.querySelector('.cv-modal')) {
      const modal = document.createElement('div');
      modal.className = 'cv-modal';
      modal.innerHTML = `
        <div class="cv-content">
          <div class="cv-header">
            <h2>Curriculum Vitae</h2>
            <button class="close-cv">×</button>
          </div>
          <div class="cv-body">
            <!-- Iframe will be lazy-loaded when modal is opened -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const cvLinks = document.querySelectorAll('a[href*="/cv"], a[href*="CV"]');
    const modal = document.querySelector('.cv-modal');
    const cvBody = modal.querySelector('.cv-body');

    cvLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        if (!cvBody.querySelector('iframe')) {
          const iframe = document.createElement('iframe');
          iframe.src = '/files/CV_DavidVanDijcke.pdf';
          cvBody.appendChild(iframe);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeBtn = modal.querySelector('.close-cv');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Publication search
  initPublicationSearch() {
    const pubs = document.querySelectorAll('.pub-entry');
    if (pubs.length > 3) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'publication-search';
      searchContainer.innerHTML = `
        <input type="text" placeholder="Search publications..." class="pub-search-input">
        <div class="search-stats"></div>
      `;

      const firstPub = pubs[0];
      if (firstPub && firstPub.parentNode) {
        firstPub.parentNode.insertBefore(searchContainer, firstPub);

        const searchInput = searchContainer.querySelector('.pub-search-input');
        const searchStats = searchContainer.querySelector('.search-stats');

        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          let visibleCount = 0;

          pubs.forEach(pub => {
            const text = pub.textContent.toLowerCase();
            if (text.includes(query)) {
              pub.style.display = '';
              visibleCount++;
            } else {
              pub.style.display = 'none';
            }
          });

          searchStats.textContent = query ? `Showing ${visibleCount} of ${pubs.length} publications` : '';
        });
      }
    }
  }

  // Enhanced research assistant
  enhanceResearchAssistant() {
    setTimeout(() => {
      const aiBtn = document.querySelector('#ai-assistant-btn');
      if (aiBtn && !this.isMobile) {
        aiBtn.style.width = '70px';
        aiBtn.style.height = '70px';
        aiBtn.style.fontSize = '32px';
      }
    }, 1000);
  }
}

// Add CSS for publication search
const style = document.createElement('style');
style.textContent = `
  .publication-search {
    margin-bottom: 2rem;
  }

  .pub-search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #ddd8d0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
  }

  .pub-search-input:focus {
    outline: none;
    border-color: #232D4B;
    box-shadow: 0 0 0 3px rgba(35, 45, 75, 0.1);
  }

  .search-stats {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #8a8a8a;
  }

  /* Mobile specific fixes */
  @media (max-width: 768px) {
    body {
      padding-bottom: 4rem !important;
    }

    .page__content {
      padding-bottom: 3rem !important;
      margin-bottom: 2rem !important;
    }

    .archive {
      padding-bottom: 3rem !important;
    }

    .page__footer {
      position: relative !important;
      margin-top: 3rem !important;
    }
  }
`;
document.head.appendChild(style);

// Initialize
new EnhancedEffects();
