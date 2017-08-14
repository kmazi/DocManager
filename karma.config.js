module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'test-context.js', watched: false }
    ],
    preprocessors: {
      '**/spec/app/*.js': ['coverage']
    },
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coverage'
    ],
    reporters: ['progress', 'coverage'],
    port: 1845,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autowatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage/Server',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    }
  });
};

// module.exports = function (config) {
//   config.set({
//     browsers: ['PhantomJS'],
//     files: [
//       { pattern: 'test-context.js', watched: false }
//     ],
//     frameworks: ['jasmine'],
//     preprocessors: {
//       'test-context.js': ['webpack'],
//       'spec/**/*.js': ['babel'],
//       'test/**/*.js': ['babel']
//     },
//     webpack: {
//       module: {
//         loaders: [
//           { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
//         ]
//       },
//       watch: true
//     },
//     webpackServer: {
//       noInfo: true
//     }
//   });
// };
