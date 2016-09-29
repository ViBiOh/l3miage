var printPdfRegex = /print-pdf/gi;
var reserved = {
  search: [printPdfRegex],
  hash: []
};

(function() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = window.location.search.match(printPdfRegex) ? './css/print/pdf.css?v={{version}}' : './css/print/paper.css?v={{version}}';
  document.getElementsByTagName('head')[0].appendChild(link);
})();

var config = (function() {
  var override = {};

  function isReserved(location, value) {
    for (var i = 0, size = reserved[location].length; i < size; i++) {
      if (value.match(reserved[location][0])) {
        return true;
      }
    }
    return false;
  }

  function overrideConfig(location, regex, property, defaultValue) {
    override[property] = defaultValue;
    window.location[location].replace(regex, function(match, group) {
      if (!isReserved(location, group)) {
        override[property] = group;
      }
    });
  }

  overrideConfig('search', /([^&?/]+)/gmi, 'markdown', 'introduction');
  overrideConfig('hash', /([0-9]+)$/gmi, 'pageNum', 0);

  return override;
})();

function removeAllChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function loadMarkdown() {
  var slides = document.getElementsByClassName('slides')[0];
  removeAllChild(slides);

  var section = document.createElement('section');
  section.setAttribute('data-markdown', './doc/' + config.markdown + '.md?v={{version}}');
  section.setAttribute('data-separator', '\n\n\n');
  section.setAttribute('data-charset', 'utf-8');

  slides.appendChild(section);

  RevealMarkdown.initialize();
  Reveal.navigateTo(config.pageNum);
}

Reveal.addEventListener('ready', function() {
  loadMarkdown();
});

Reveal.initialize({
  controls: false,
  progress: true,
  history: true,
  center: true,
  transition: 'slide',
  dependencies: [
    { src: './plugin/markdown/marked.js'},
    { src: './plugin/markdown/markdown.js'},
    {
      src: './lib/js/classList.js',
      async: true,
      condition: function() {
        return !document.body.classList;
      }
    }, {
      src: './plugin/highlight/highlight.js',
      async: true,
      callback: function() {
        hljs.initHighlightingOnLoad();
      }
    },
  ]
});