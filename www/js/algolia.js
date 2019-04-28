/**
 * Retrieve index from algolia lib.
 * @param  {String} app  App name
 * @param  {String} key  Search key
 * @param  {String} name Index name
 * @return {Index}       Algolia index
 */
function algoliaGetIndex(app, key, name) {
  return algoliasearch(app, key).initIndex(name);
}

/**
 * Handle input change for trigerring search.
 * @param  {Index} index        Algolia index
 * @param  {DOMElement} input   Input text of query
 * @param  {DOMElement} results Container of results
 */
function algoliaHandleInput(index, input, results) {
  let changeTimeout;

  input.addEventListener('input', e => {
    clearTimeout(changeTimeout);

    if (e.target.value) {
      changeTimeout = setTimeout(algoliaSearchQuery, 300, index, e.target.value, results);
    } else {
      algoliaClearNode(results);
    }
  });
}

/**
 * Generate click handler for result.
 * @param  {Object} hit Hit returned by algolia index, containing H and V slides
 * @return {Function}   Function to pass to event listener
 */
function algoliaGetResultClickHandler(hit) {
  return () => (document.location.href = hit.url);
}

/**
 * Perform algolia search from query and fill output
 * @param  {Index} index        Algolia index
 * @param  {String} query       Wanted query
 * @param  {DOMElement} results Container of results
 */
function algoliaSearchQuery(index, query, results) {
  index.search({ query, hitsPerPage: 5 }, (err, output) => {
    if (err) {
      console.error(err);
      algoliaShowMessage('(╯°□°）╯︵ ┻━┻', "C'est cassé !", 'algolia__results--error', results);
      return;
    }

    if (output.nbHits === 0) {
      algoliaShowMessage('¯\\_(ツ)_/¯', 'On a rien trouvé', 'algolia__results--not-found', results);
      return;
    }

    algoliaShowResults(output.hits, results);
  });
}

/**
 * Render message in results
 * @param  {String} header       Header of message
 * @param  {String} message      Content of message
 * @param  {String} className    Class of message
 * @param  {DOMEelement} results Container of results
 */
function algoliaShowMessage(header, message, className, results) {
  algoliaClearNode(results);

  const result = algoliaGenerateResult(header, message);
  result.className = className;

  results.appendChild(result);
  algoliaAddActiveClass(results);
}

/**
 * Generate result entry.
 * @param  {String} header  Header of message
 * @param  {String} message Content of message
 * @return {DOMElement}     Result to append
 */
function algoliaGenerateResult(header, message) {
  const content = document.createElement('span');
  content.innerHTML = message;

  const chapter = document.createElement('strong');
  chapter.innerHTML = header;

  const headline = document.createElement('p');
  headline.appendChild(chapter);

  const li = document.createElement('li');
  li.appendChild(headline);
  li.appendChild(content);

  return li;
}

/**
 * Display results of search.
 * @param  {Array} hits         Algolia hits
 * @param  {DOMElement} results Container of results
 */
function algoliaShowResults(hits, results) {
  algoliaClearNode(results);

  hits.forEach(hit => {
    let result = algoliaGenerateResult(hit.chapter, hit._highlightResult.content.value);
    result.addEventListener('click', algoliaGetResultClickHandler(hit));

    results.appendChild(result);
  });

  algoliaAddActiveClass(results);
}

/**
 * Remove all child nodes and hide content.
 * @param  {DOMElement} element Element to clear
 */
function algoliaClearNode(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }

  element.classList.remove('active');
}

/**
 * Clear input and release focus
 * @param  {DOMElement} input Input text of query
 */
function algoliaClearInput(input) {
  input.querySelector('input').value = '';
  document.activeElement.blur();
}

/**
 * Add active class.
 * @param {DOMElement} element Element to active
 */
function algoliaAddActiveClass(element) {
  element.classList.add('active');
}

/**
 * Navigate to results in given direction
 * @param  {int} direction Direction 1, or -1 for reverse
 */
function algoliaNavigateResults(direction) {
  const selectedClass = 'selected';

  const results = document.querySelectorAll('.algolia__results li');
  if (results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].classList.contains(selectedClass)) {
        const next = i + direction;
        if (next >= 0 && next < results.length) {
          results[i].classList.remove(selectedClass);
          results[next].classList.add(selectedClass);
        }

        return;
      }
    }
  }

  const result = document.querySelector('.algolia__results li');
  if (result) {
    result.classList.add(selectedClass);
  }
}

/**
 * Handle key in search bar.
 * @param  {Event} e KeyboardEvent
 */
function algoliaHandleResultKey(e) {
  if (e.keyCode === 40) {
    algoliaNavigateResults(1);
  } else if (e.keyCode === 38) {
    algoliaNavigateResults(-1);
  } else if (e.keyCode === 13) {
    const selected = document.querySelector('.algolia__results li.selected');
    if (selected) {
      selected.click();
    }
  }
}

/**
 * Insert search bar into the dom.
 */
function insertAlgoliaDOM() {
  document.querySelector('body').insertAdjacentHTML(
    'beforeend',
    `
<div id="search" class="algolia">
  <div class="algolia__input">
    <svg viewBox="0 0 95 95" xmlns="http://www.w3.org/2000/svg" class="algolia__logo">
      <title>Search by Algolia</title>
      <path d="M0 12.37C0 5.54 5.532 0 12.367 0h69.31c6.831 0 12.368 5.533 12.368 12.37v69.331c0 6.832-5.532 12.371-12.367 12.371h-69.31C5.536 94.072 0 88.539 0 81.702V12.37zm48.125 11.405c-14.671 0-26.58 11.898-26.58 26.588 0 14.69 11.895 26.588 26.58 26.588 14.685 0 26.58-11.912 26.58-26.602S62.81 23.775 48.125 23.775zm0 45.307c-10.343 0-18.727-8.386-18.727-18.733 0-10.346 8.384-18.732 18.727-18.732 10.344 0 18.727 8.386 18.727 18.732 0 10.347-8.383 18.733-18.727 18.733zm0-33.6v13.955c0 .408.436.68.803.49L61.3 43.501a.548.548 0 0 0 .217-.762c-2.572-4.506-7.335-7.596-12.834-7.8a.549.549 0 0 0-.558.544zM30.76 25.246l-1.62-1.62a4.082 4.082 0 0 0-5.77 0l-1.933 1.933a4.085 4.085 0 0 0 0 5.773l1.606 1.606c.245.245.64.204.844-.068a30.572 30.572 0 0 1 3.116-3.662 29.723 29.723 0 0 1 3.689-3.131c.272-.19.3-.6.068-.83zm26.063-4.234v-3.226a4.078 4.078 0 0 0-4.083-4.084h-9.5a4.078 4.078 0 0 0-4.083 4.084v3.308c0 .368.354.626.708.531a29.562 29.562 0 0 1 8.275-1.157c2.722 0 5.403.367 7.989 1.075a.55.55 0 0 0 .694-.53z" fill="#FFF" fill-rule="evenodd"/>
    </svg>
    <input type="text" name="q" placeholder="Rechercher" aria-label="Rechercher" class="algolia__search" />
  </div>

  <ol id="results" class="algolia__results"></ol>
</div>
`,
  );
}

/**
 * Initialize algolia search.
 * @param  {String} app       App name
 * @param  {String} key       Search key
 * @param  {String} indexName Index name
 */
async function algoliaInit(app, key, indexName) {
  await Promise.all([
    addScript('https://cdn.jsdelivr.net/algoliasearch/3/algoliasearchLite.min.js'),
    addStyle('/css/algolia.css?v={{version}}'),
  ]);

  insertAlgoliaDOM();
  const index = algoliaGetIndex(app, key, indexName);

  const searchBar = document.getElementById('search');
  const results = document.getElementById('results');

  if (searchBar && results) {
    algoliaHandleInput(index, searchBar, results);
    algoliaAddActiveClass(searchBar);

    searchBar.addEventListener('keyup', algoliaHandleResultKey);
    Reveal.addEventListener('slidechanged', () => {
      algoliaClearInput(searchBar);
      algoliaClearNode(results);
    });
  }
}

(async () => {
  const response = await fetch('/env');
  const { ALGOLIA_APP: app, ALGOLIA_KEY: key, ALGOLIA_INDEX: indexName } = await response.json();

  if (!app || !key || !indexName) {
    return;
  }

  algoliaInit(app, key, indexName);
})();
