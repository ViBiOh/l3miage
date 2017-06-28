(function() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = './css/print/paper.css?v={{version}}';
  document.getElementsByTagName('head')[0].appendChild(link);
})();

var config = (function() {
  var override = {};

  function overrideConfig(location, regex, property, defaultValue) {
    override[property] = defaultValue;
    window.location[location].replace(regex, function(match, group) {
      override[property] = group;
    });
  }

  overrideConfig('search', /\?q=([^&?/]+)/gim, 'markdown', 'introduction');
  overrideConfig('hash', /([0-9]+)$/gim, 'pageNum', 0);

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
  controls: true,
  progress: true,
  history: true,
  center: true,
  transition: 'slide',
  dependencies: [
    {
      src: './plugin/markdown/marked.js',
      callback: function() {
        var renderer = new marked.Renderer();

        renderer.image = function(href, title, text) {
          console.log(href);
          return '<img data-src="' + href + '" />';
        };

        marked.setOptions({ renderer: renderer });
      },
    },
    { src: './plugin/markdown/markdown.js' },
    {
      src: './lib/js/classList.js',
      async: true,
      condition: function() {
        return !document.body.classList;
      },
    },
    {
      src: './plugin/highlight/highlight.js',
      async: true,
      callback: function() {
        hljs.initHighlightingOnLoad();
      },
    },
  ],
});
