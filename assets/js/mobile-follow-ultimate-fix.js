// Mobile Follow Button Fix - Override default behavior
(function($) {
  'use strict';

  function initMobileFollow() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;

    const $btn = $('.author__urls-wrapper .btn.btn--inverse');
    const $menu = $('.author__urls.social-icons');
    const $wrapper = $('.author__urls-wrapper');

    if (!$btn.length || !$menu.length || !$wrapper.length) {
      console.warn('Mobile follow: Elements not found');
      return;
    }

    // Remove the default jQuery handler from _main.js
    $btn.off('click');

    // Force proper z-index and display
    $menu.css({
      'z-index': '9999',
      'display': 'none'
    });

    // State tracking
    let isOpen = false;

    // Toggle function
    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      isOpen = !isOpen;

      if (isOpen) {
        // Show with proper z-index
        $menu.css({
          'display': 'block',
          'z-index': '9999'
        }).addClass('show');
        $btn.attr('aria-expanded', 'true').addClass('open');
      } else {
        // Hide
        $menu.fadeOut(200, function() {
          $(this).removeClass('show');
        });
        $btn.attr('aria-expanded', 'false').removeClass('open');
      }
    }

    // Close menu when clicking outside
    function handleOutsideClick(e) {
      if (isOpen && !$wrapper[0].contains(e.target)) {
        isOpen = false;
        $menu.fadeOut(200, function() {
          $(this).removeClass('show');
        });
        $btn.attr('aria-expanded', 'false').removeClass('open');
      }
    }

    // Setup event listeners
    $btn.on('click', toggleMenu);
    $(document).on('click', handleOutsideClick);

    // Add accessibility attributes
    $btn.attr({
      'aria-haspopup': 'true',
      'aria-expanded': 'false'
    });

    console.log('Mobile follow button initialized successfully');
  }

  // Initialize when both DOM and jQuery are ready
  function tryInit() {
    if (typeof $ !== 'undefined' && $.fn && document.readyState !== 'loading') {
      // Wait a bit for _main.js to finish its setup
      setTimeout(initMobileFollow, 500);
    } else {
      setTimeout(tryInit, 100);
    }
  }

  tryInit();

  // Re-initialize on window resize if crossing mobile breakpoint
  let wasMobile = window.innerWidth <= 768;
  $(window).on('resize', function() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== wasMobile) {
      wasMobile = isMobile;
      if (isMobile) {
        setTimeout(initMobileFollow, 100);
      }
    }
  });

})(jQuery);