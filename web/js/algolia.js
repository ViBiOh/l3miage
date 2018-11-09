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
  var changeTimeout;

  input.addEventListener('input', function(e) {
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
  return function() {
    document.location.href = hit.url;
  }
}

/**
 * Perform algolia search from query and fill output
 * @param  {Index} index        Algolia index
 * @param  {String} query       Wanted query
 * @param  {DOMElement} results Container of results
 */
function algoliaSearchQuery(index, query, results) {
  index.search({ query, hitsPerPage: 5 }, function(err, output) {
    if (err) {
      console.error(err)
      algoliaShowMessage('(╯°□°）╯︵ ┻━┻', 'C\'est cassé !', 'algolia__results--error', results)
      return;
    }

    if (output.nbHits === 0) {
      algoliaShowMessage('¯\\_(ツ)_/¯', 'On a rien trouvé', 'algolia__results--not-found', results)
      return
    }

    algoliaShowResults(output.hits, results)
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

  var result = algoliaGenerateResult(header, message)
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
  var content = document.createElement('span');
  content.innerHTML = message;

  var chapter = document.createElement('strong')
  chapter.innerHTML = header

  var headline = document.createElement('p')
  headline.appendChild(chapter)

  var li = document.createElement('li');
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

  for (var i = 0; i < hits.length; i++) {
    var hit = hits[i];

    var result = algoliaGenerateResult(hit.chapter, hit._highlightResult.content.value)
    result.addEventListener('click', algoliaGetResultClickHandler(hit))

    results.appendChild(result);
  }

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
  var selectedClass = 'selected';

  var results = document.querySelectorAll('.algolia__results li');
  if (results) {
    for (var i = 0; i < results.length; i++) {
      if (results[i].classList.contains(selectedClass)) {
        var next = i + direction;
        if (next >= 0 && next < results.length) {
          results[i].classList.remove(selectedClass);
          results[next].classList.add(selectedClass);
        }

        return
      }
    }
  }

  var result = document.querySelector('.algolia__results li');
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
    var selected = document.querySelector('.algolia__results li.selected');
    if (selected) {
      selected.click();
    }
  }
}

/**
 * Initialize algolia search.
 * @param  {String} app   App name
 * @param  {String} key   Search key
 * @param  {String} index Index name
 */
function algoliaInit(app, key, index) {
  if (!app || !key || !index) {
    return;
  }

  var index = algoliaGetIndex(app, key, index);
  var searchBar = document.getElementById('search');
  var results = document.getElementById('results');

  algoliaHandleInput(index, searchBar, results);

  algoliaAddActiveClass(searchBar);

  searchBar.addEventListener('keyup', algoliaHandleResultKey);
  Reveal.addEventListener('slidechanged', function() {
    algoliaClearInput(searchBar)
    algoliaClearNode(results)
  });
}

fetch('/env')
  .then(function(response) {
    return response.json();
  })
  .then(function(config) {
    algoliaInit(config.ALGOLIA_APP, config.ALGOLIA_KEY, config.ALGOLIA_INDEX);
  })
  .catch(function(e) {
    console.error(e)
  });
