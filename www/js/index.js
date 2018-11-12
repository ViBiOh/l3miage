/**
 * Insert head script into dom.
 * @return {Promise} Promise resolved when script is loaded
 */
function insertHeadScript() {
  return new Promise(resolve => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/vendor/head.min.js?v={{version}}';
    script.async = 'true';
    script.onload = resolve;

    document.querySelector('head').appendChild(script);
  });
}

/**
 * Insert reveal script into dom.
 * @return {Promise} Promise resolved when script is loaded
 */
function insertRevealScript() {
  return new Promise(resolve => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/vendor/reveal.js?v={{version}}';
    script.async = 'true';
    script.onload = resolve;

    document.querySelector('head').appendChild(script);
  });
}

Promise.all([insertHeadScript(), insertRevealScript()])
  .then(function() {
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
  })
  .catch(function(e) {
    console.error(e);
  });
