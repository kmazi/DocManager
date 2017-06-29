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
const compiler = Webpack(config);
const router = express.Router();

app.use(webpackdevmiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true
}));
path.join();
app.use(webpackhotmiddleware(compiler));
// set static path
const sourcePath = path.join(__dirname, '/client/');
app.use(express.static(sourcePath));

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all routes
routes(router, compiler);

app.use('/', router);

module.exports = app;
