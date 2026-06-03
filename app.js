(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a'));
  var pages = {
    home: document.getElementById('home'),
    pictures: document.getElementById('pictures'),
    timeline: document.getElementById('timeline'),
    report: document.getElementById('report')
  };
  var current = 'home';
  var busy = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActiveNav(name) {
    links.forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === name);
    });
  }

  function showInstantly(name) {
    Object.keys(pages).forEach(function (key) {
      pages[key].classList.toggle('is-active', key === name);
    });
    setActiveNav(name);
    current = name;
  }

  function go(name) {
    if (busy || name === current || !pages[name]) return;

    var outgoing = pages[current];
    var incoming = pages[name];
    setActiveNav(name);
    window.scrollTo({ top: 0 });

    if (reduce) {
      showInstantly(name);
      return;
    }

    busy = true;
    outgoing.classList.add('fold-out');
    incoming.classList.add('is-active', 'fold-in');

    incoming.addEventListener('animationend', function done() {
      incoming.removeEventListener('animationend', done);
      outgoing.classList.remove('is-active', 'fold-out');
      incoming.classList.remove('fold-in');
      current = name;
      busy = false;
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      go(link.dataset.page);
      history.replaceState(null, '', '#' + link.dataset.page);
    });
  });

  var initial = (location.hash || '#home').slice(1);
  if (pages[initial]) {
    showInstantly(initial);
  }
})();