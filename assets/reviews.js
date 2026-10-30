/* Review carousel: auto-advances, dashes below, pauses on hover/focus/off-screen, swipe. */
(function () {
  var root = document.querySelector('[data-reviews]');
  if (!root) return;
  var cards = [].slice.call(root.querySelectorAll('.rv-card'));
  var dots = [].slice.call(root.querySelectorAll('.rv-dash'));
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ms = +root.getAttribute('data-interval') || 6500;
  var i = 0, timer = null, paused = false, visible = true;

  function go(n) {
    i = (n + cards.length) % cards.length;
    cards.forEach(function (c, k) {
      var on = k === i;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (d, k) {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
  }
  function start() {
    clearInterval(timer);
    if (calm || cards.length < 2) return;
    timer = setInterval(function () { if (!paused && visible && !document.hidden) go(i + 1); }, ms);
  }
  dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); start(); }); });
  root.addEventListener('mouseenter', function () { paused = true; });
  root.addEventListener('mouseleave', function () { paused = false; });
  root.addEventListener('focusin', function () { paused = true; });
  root.addEventListener('focusout', function () { paused = false; });
  var x0 = null;
  root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); start(); }
    x0 = null;
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.25 }).observe(root);
  }
  go(0);
  start();
})();
