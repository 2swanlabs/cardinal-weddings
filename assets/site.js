(function () {
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Photo sliders: auto-advance, dots, swipe, pause on hover / off-screen */
  function initSlider(el) {
    var slides = [].slice.call(el.querySelectorAll('.slide'));
    var dots = [].slice.call(el.querySelectorAll('.slider-dot'));
    var i = 0, timer = null, paused = false, visible = true;
    var ms = +el.getAttribute('data-interval') || 5500;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    }
    function start() {
      if (calm || slides.length < 2) return;
      clearInterval(timer);
      timer = setInterval(function () { if (!paused && visible && !document.hidden) go(i + 1); }, ms);
    }
    dots.forEach(function (d, k) {
      d.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(k); start(); });
    });
    el.addEventListener('mouseenter', function () { paused = true; });
    el.addEventListener('mouseleave', function () { paused = false; });
    el.addEventListener('focusin', function () { paused = true; });
    el.addEventListener('focusout', function () { paused = false; });
    var x0 = null;
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); start(); }
      x0 = null;
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.2 }).observe(el);
    }
    setTimeout(start, Math.random() * 1200);
  }
  [].slice.call(document.querySelectorAll('[data-slider]')).forEach(initSlider);

  /* Gentle fade-in for sections as they scroll into view (opacity only, so fixed modals are never affected) */
  var secs = [].slice.call(document.querySelectorAll('main section')).slice(1);
  if (!calm && 'IntersectionObserver' in window) {
    secs.forEach(function (s) { s.classList.add('reveal'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        t.classList.add('reveal-in');
        io.unobserve(t);
        setTimeout(function () { t.classList.remove('reveal', 'reveal-in'); }, 1000);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    secs.forEach(function (s) { io.observe(s); });
  }
})();
