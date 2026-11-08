// Прилага запазената тема преди първото изчертаване, за да няма примигване. Отделен файл заради CSP.
try {
  var t = localStorage.getItem('pulsar.theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) { /* частен режим */ }
