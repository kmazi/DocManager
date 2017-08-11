const config = require('./config');

module.exports = {
  'Open browser': browser =>
  browser
    .url(config.url)
    .pause(1000)
    .end()
};
