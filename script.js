// Smooth custom cursor with trail
let cursor = document.querySelector('.custom-cursor');
let trail = document.querySelector('.cursor-trail');

// If elements are missing, create them
if (!cursor) {
  cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);
}

if (!trail) {
  trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.setAttribute('aria-hidden', 'true');
  document.body.appendChild(trail);
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (prefersReduced || isTouch) {
  cursor.style.display = 'none';
  trail.style.display = 'none';
} else {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let trailX = mouseX;
  let trailY = mouseY;

  // Mouse move handler
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Show/hide cursor when entering/leaving window
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity = '0';
  });

  // Interactive elements hover effect
  const interactiveSelector = 'a, button, [data-cursor], .project, .btn, .logo-noname, .project-card, .nav-link, .card';

  function addHoverListeners() {
    document.querySelectorAll(interactiveSelector).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      el.addEventListener('focus', () => cursor.classList.add('hover'));
      el.addEventListener('blur', () => cursor.classList.remove('hover'));
    });
  }
  addHoverListeners();

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));

  // Watch for new elements
  const obs = new MutationObserver(addHoverListeners);
  obs.observe(document.body, { childList: true, subtree: true });

  // Animation loop
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function render() {
    // Cursor follows mouse with smooth lerp
    cursorX = lerp(cursorX, mouseX, 0.18);
    cursorY = lerp(cursorY, mouseY, 0.18);
    
    // Trail follows cursor with slower lerp
    trailX = lerp(trailX, cursorX, 0.12);
    trailY = lerp(trailY, cursorY, 0.12);
    
    // Update positions (centered on mouse)
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.style.transform = 'translate(-50%, -50%)';
    
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    trail.style.transform = 'translate(-50%, -50%)';
    
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

window.addEventListener('pagehide', () => {
  cursor.classList.remove('hover', 'click');
});

// ---------------------------
// Fullscreen hero reveal logic
// ---------------------------
(function(){
  const body = document.body;
  const revealBtn = document.getElementById('reveal-btn');
  let revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    // allow scrolling
    body.classList.remove('locked');
    // smooth scroll to the top of main content after a short delay
    const next = document.querySelector('#about') || document.querySelector('#main');
    if (next) {
      setTimeout(() => {
        next.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
    // remove the temporary listeners
    window.removeEventListener('wheel', wheelHandler, { passive: false });
    window.removeEventListener('touchstart', touchHandler, { passive: false });
    window.removeEventListener('keydown', keyHandler);
  }

  function wheelHandler(e) {
    if (e.deltaY > 10) {
      e.preventDefault();
      reveal();
    }
  }
  function touchHandler(e) {
    reveal();
  }
  function keyHandler(e) {
    // space, pageDown, arrowDown
    if (e.code === 'Space' || e.code === 'PageDown' || e.code === 'ArrowDown') {
      e.preventDefault();
      reveal();
    }
  }

  // Lock scrolling on first load
  body.classList.add('locked');

  // Attach listeners to reveal
  window.addEventListener('wheel', wheelHandler, { passive: false });
  window.addEventListener('touchstart', touchHandler, { passive: false });
  window.addEventListener('keydown', keyHandler);
  if (revealBtn) revealBtn.addEventListener('click', reveal);
})();
