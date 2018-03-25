/**
 * Retrieve index from algolia lib.
 * @param  {String} app  App name
 * @param  {String} key  Search key
 * @param  {String} name Index name
 * @return {Index}       Algolia index
 */
function getIndex(app, key, name) {
  return algoliasearch(app, key).initIndex(name);
}

/**
 * Handle input change for trigerring search.
 * @param  {Index} index        Algolia index
 * @param  {DOMElement} input   Input text of query
 * @param  {DOMElement} results Container of results
 */
function handleInput(index, input, results) {
  var changeTimeout;

  input.addEventListener('input', function(e) {
    clearTimeout(changeTimeout);

    if (e.target.value) {
      changeTimeout = setTimeout(searchQuery, 300, index, e.target.value, results);
    } else {
      clearNode(results);
    }
  });
}

/**
 * Generate click handler for result.
 * @param  {Object} hit Hit returned by algolia index, containing H and V slides
 * @return {Function}   Function to pass to event listener
 */
function getResultClickHandler(hit) {
  return function() {
    Reveal.slide(hit.h, hit.v)
  }
}

/**
 * Perform algolia search from query and fill output
 * @param  {Index} index        Algolia index
 * @param  {String} query       Wanted query
 * @param  {DOMElement} results Container of results
 */
function searchQuery(index, query, results) {
  index.search({ query, hitsPerPage: 5 }, function(err, output) {
    if (err) {
      console.error(err)
      return;
    }

    showResults(output.hits, results)
  });
}

/**
 * Display results of search.
 * @param  {Array} hits         Algolia hits
 * @param  {DOMElement} results Container of results
 */
function showResults(hits, results) {
  clearNode(results);

  for (var i = 0; i < hits.length; i++) {
    var hit = hits[i];

    var content = document.createElement('span');
    content.innerHTML = hit._highlightResult.content.value;

    var chapter = document.createElement('strong')
    chapter.innerHTML = hit.chapter

    var headline = document.createElement('p')
    headline.appendChild(chapter)

    var li = document.createElement('li');
    li.appendChild(headline);
    li.appendChild(content);

    li.addEventListener('click', getResultClickHandler(hit))

    results.appendChild(li);
  }

  addActiveClass(results);
}

/**
 * Remove all child nodes and hide content.
 * @param  {DOMElement} element Element to clear
 */
function clearNode(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }

  element.className = element.className.replace(' active', '');
}

/**
 * Add active class.
 * @param {DOMElement} element Element to active
 */
function addActiveClass(element) {
  element.className += ' active';
}

fetch('/env')
  .then(function(response) {
    return response.json();
  })
  .then(function(config) {
    var index = getIndex(config.ALGOLIA_APP, config.ALGOLIA_KEY, config.ALGOLIA_INDEX);
    var searchBar = document.getElementById('search');
    var results = document.getElementById('results');

    handleInput(index, searchBar, results);

    addActiveClass(searchBar);

    Reveal.addEventListener('slidechanged', function() {
      clearNode(results)
    });
  })
  .catch(function(e) {
    console.error(e)
  });