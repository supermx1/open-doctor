module.exports = {
  globDirectory: 'www/',
  globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,jpeg,svg,html}'],
  /* pass array of globs to exclude from caching */
  globIgnores: [],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'www/service-worker.js',
  maximumFileSizeToCacheInBytes: 1024 * 1024 * 5, // 5MB
  skipWaiting: true,
  sourcemap: false,
  offlineGoogleAnalytics: true,
};
