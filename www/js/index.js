Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  transition: 'slide',
  dependencies: [
    {
      src: '/vendor/marked.js',
      callback: function() {
        var renderer = new marked.Renderer();

        renderer.image = function(href, title, text) {
          return '<img data-src="/doc/' + href + '?v={{version}}" alt="' + title + '" />';
        };

        renderer.link = function(href, title, text) {
          return (
            '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' + text + '</a>'
          );
        };

        marked.setOptions({ renderer: renderer });
      },
    },
    { src: '/vendor/markdown.js' },
    {
      src: '/vendor/classList.js',
      condition: function() {
        return !document.body.classList;
      },
    },
    {
      src: '/vendor/highlight.js',
      async: true,
      callback: function() {
        hljs.initHighlightingOnLoad();
      },
    },
  ],
});
