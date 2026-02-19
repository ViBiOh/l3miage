(function (h, o, u, n, d) {
  h = h[d] = h[d] || {
    q: [],
    onReady: function (c) {
      h.q.push(c);
    },
  };
  d = o.createElement(u);
  d.async = 1;
  d.src = n;
  d.crossOrigin = '';
  n = o.getElementsByTagName(u)[0];
  n.parentNode.insertBefore(d, n);
})(
  window,
  document,
  'script',
  'https://www.datadoghq-browser-agent.com/eu1/v6/datadog-rum.js',
  'DD_RUM',
);
window.DD_RUM.onReady(function () {
  window.DD_RUM.init({
    clientToken: 'pub90d57e5af272d39c1d7622f202ba53c8',
    applicationId: 'e7cd2bbf-1b88-40d1-a22a-30f943f37774',
    site: 'datadoghq.eu',
    service: 'l3miage',
    env: 'prod',
    version: '{{version}}',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackBfcacheViews: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
});
