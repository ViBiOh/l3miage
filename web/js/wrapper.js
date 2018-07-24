fetch('/env')
  .then(function(response) {
    return response.json();
  })
  .then(function(config) {
    initRollbar(config.ROLLBAR_TOKEN, config.ENVIRONMENT);
    algoliaInit(config.ALGOLIA_APP, config.ALGOLIA_KEY, config.ALGOLIA_INDEX);
  })
  .catch(function(e) {
    console.error(e)
  });
