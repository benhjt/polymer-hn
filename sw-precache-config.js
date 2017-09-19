/* eslint-env node */

module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/index.html?homescreen=1',
    '/manifest.json',
    '/bower_components/webcomponentsjs/*',
  ],
  navigateFallback: 'index.html',
};
