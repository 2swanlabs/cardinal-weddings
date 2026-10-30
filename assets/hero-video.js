/* Seamless hero video: plays herovideo-1..N.mp4 one after another.
   The next clip is started LEAD seconds (default 0.09) before the current one ends,
   using two stacked <video> elements, so no gap or flash is ever visible.
   Clip list and lead time live on #hero-video (data-segments, data-lead). */
(function () {
  var root = document.getElementById('hero-video');
  if (!root) return;
  var list = (root.getAttribute('data-segments') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var LEAD = parseFloat(root.getAttribute('data-lead')) || 0.09;
  var vids = [].slice.call(root.querySelectorAll('video'));
  if (!list.length || vids.length < 2) return;

  // Respect reduced motion and data saver: keep the still hero photo
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && conn.saveData) return;

  var n = list.length, idx = 0, cur = vids[0], nxt = vids[1], swapping = false, raf = 0;

  vids.forEach(function (v) { v.muted = true; v.defaultMuted = true; v.loop = false; v.playsInline = true; });
  function load(v, i) { v.src = list[i % n]; v.load(); }

  load(cur, 0);
  if (n > 1) load(nxt, 1);
  cur.play().catch(function () {});

  function tick() {
    if (!swapping && cur.duration && isFinite(cur.duration) && cur.currentTime >= cur.duration - LEAD) {
      swapTo();
    } else {
      raf = requestAnimationFrame(tick);
    }
  }

  function swapTo() {
    swapping = true;
    var started = false;
    function go() {
      nxt.currentTime = 0;
      var shown = false;
      function show() {
        if (shown) return;
        shown = true;
        nxt.style.zIndex = 2; cur.style.zIndex = 1;      // new clip on top, already playing
        var old = cur; cur = nxt; nxt = old;
        idx = (idx + 1) % n;
        setTimeout(function () { old.pause(); load(old, (idx + 1) % n); }, 250);  // preload the clip after this one
        swapping = false;
        raf = requestAnimationFrame(tick);
      }
      if ('requestVideoFrameCallback' in nxt) nxt.requestVideoFrameCallback(show);
      else nxt.addEventListener('playing', show, { once: true });
      var p = nxt.play();
      if (p && p.catch) p.catch(function () { swapping = false; raf = requestAnimationFrame(tick); });
    }
    if (nxt.readyState >= 3) go();
    else nxt.addEventListener('canplay', function () { if (!started) { started = true; go(); } }, { once: true });
  }

  raf = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); cur.pause(); }
    else if (!swapping) { cur.play().catch(function () {}); raf = requestAnimationFrame(tick); }
  });
})();
