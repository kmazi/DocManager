import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import Webpack from 'webpack';
import webpackdevmiddleware from 'webpack-dev-middleware';
import webpackhotmiddleware from 'webpack-hot-middleware';

import config from '../webpack.config';
import routes from './routes/routes';
// Set up the express app
const app = express();
const router = express.Router();
if (process.env.NODE_ENV === "development") {
  const compiler = Webpack(config);
  app.use(webpackdevmiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    historyApiFallback: true,
    hot: true
  }));

  app.use(webpackhotmiddleware(compiler));
}

// set static path
const sourcePath = express.static(path.join(__dirname, '../client/src/assets'));
app.use('/static', sourcePath);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', router);
// get all routes
routes(router);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports = app;
