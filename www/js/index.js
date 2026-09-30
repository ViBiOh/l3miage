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
