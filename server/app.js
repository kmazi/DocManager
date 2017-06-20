import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes/routes';

// Set up the express app
const app = express();
const router = express.Router();

// set static path

const sourcePath = path.join(__dirname, '/client/');
app.use(express.static(sourcePath));

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all routes
routes(router);

app.use('/', router);

module.exports = app;
