(function () {
  var F = {
    'poppins': { n: 'Poppins', q: 'Poppins:wght@300;400;500;600', s: '"Poppins",sans-serif' },
    'inter': { n: 'Inter', q: 'Inter:wght@300;400;500;600', s: '"Inter",sans-serif' },
    'dm-sans': { n: 'DM Sans', q: 'DM+Sans:wght@300;400;500;600', s: '"DM Sans",sans-serif' },
    'montserrat': { n: 'Montserrat', q: 'Montserrat:wght@300;400;500;600', s: '"Montserrat",sans-serif' },
    'manrope': { n: 'Manrope', q: 'Manrope:wght@300;400;500;600', s: '"Manrope",sans-serif' },
    'open-sans': { n: 'Open Sans', q: 'Open+Sans:wght@300;400;500;600', s: '"Open Sans",sans-serif' },
    'helvetica': { n: 'Helvetica', q: null, s: '"Helvetica Neue",Helvetica,Arial,sans-serif' },
    'lora': { n: 'Lora', q: 'Lora:ital,wght@0,400;0,500;0,600;1,400', s: '"Lora",serif' },
    'cormorant': { n: 'Cormorant Garamond', q: 'Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400', s: '"Cormorant Garamond",serif' }
  };
  var DEFAULT_NAME = 'Playfair Display + Plus Jakarta Sans';
  var KEY = 'cardinal-font', root = document.documentElement;
  root.classList.add('js');

  function apply(id) {
    var f = F[id], st = document.getElementById('font-override'), ln = document.getElementById('font-link');
    if (!f) {
      if (st) st.remove();
      if (ln) ln.remove();
      root.classList.remove('font-custom');
      return;
    }
    if (f.q) {
      if (!ln) { ln = document.createElement('link'); ln.id = 'font-link'; ln.rel = 'stylesheet'; document.head.appendChild(ln); }
      ln.href = 'https://fonts.googleapis.com/css2?family=' + f.q + '&display=swap';
    } else if (ln) { ln.remove(); }
    if (!st) { st = document.createElement('style'); st.id = 'font-override'; document.head.appendChild(st); }
    st.textContent = 'html.font-custom body,html.font-custom body *:not(.material-symbols-outlined){font-family:' + f.s + ' !important}';
    root.classList.add('font-custom');
  }

  var cur = null;
  try { cur = localStorage.getItem(KEY); } catch (e) {}
  if (cur && F[cur]) apply(cur); else cur = 'default';

  document.addEventListener('DOMContentLoaded', function () {
    var sel = document.getElementById('font-select'), lab = document.getElementById('font-current');
    if (!sel) return;
    sel.value = F[cur] ? cur : 'default';
    function label() { if (lab) lab.textContent = 'Currently: ' + (F[sel.value] ? F[sel.value].n : DEFAULT_NAME); }
    label();
    sel.addEventListener('change', function () {
      var id = sel.value;
      apply(id);
      try { if (id === 'default') localStorage.removeItem(KEY); else localStorage.setItem(KEY, id); } catch (e) {}
      label();
    });
  });
})();
