/* eslint-disable no-var */
/* eslint-disable no-console */
import http from 'http';
import dotenv from 'dotenv';

import app from './app';

// create server
var server = http.createServer(app);
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 1844;
app.set('port', port);

console.log(`Running on ${process.env.NODE_ENV} environment`);
if (process.env.NODE_ENV === 'development') {
  console.log(`Local url is http://localhost:${port}`);
}

server.listen(port);
