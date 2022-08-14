/**
 * Add a script to the dom.
 * @return {Promise} Promise resolved when script is loaded
 */
async function addScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = 'true';
    script.onload = resolve;

    document.querySelector('head').appendChild(script);
  });
}

/**
 * Add a style to the dom.
 * @return {Promise} Promise resolved when style is loaded
 */
async function addStyle(src) {
  return new Promise((resolve) => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = src;
    style.onload = resolve;

    document.querySelector('head').appendChild(style);
  });
}

/**
 * Insert reveal scripts into dom.
 * @return {Promise} Promise resolved when script is loaded
 */
async function insertRevealScripts() {
  await addScript('/vendor/reveal.js?v={{version}}');
  await addScript('/vendor/markdown.js?v={{version}}');
  await addScript('/vendor/highlight.js?v={{version}}');
}

/**
 * Get configured marked renderer.
 * @return {marked.Renderer} Configured renderer
 */
function getMarkedRenderer() {
  const renderer = new (RevealMarkdown().marked.Renderer)();

  renderer.image = (href, title) =>
    `<img data-src="/doc/${href}?v={{version}}" alt="${title}" />`;
  renderer.link = (href, _, text) => `<a href="${href}">${text}</a>`;

  return renderer;
}

(async () => {
  await insertRevealScripts();

  Reveal.addEventListener('ready', () => {
    const hljs = RevealHighlight();
    document.querySelectorAll('pre code').forEach((block) => {
      console.log(block);
      hljs.highlightBlock(block);
    });
  });

  Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    transition: 'slide',
    markdown: {
      renderer: getMarkedRenderer(),
    },
    plugins: [RevealMarkdown, RevealHighlight],
  });
})();
