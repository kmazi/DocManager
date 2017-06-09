import express from 'express';

const app = express();
// create app routes
app.get('/', (req, res) => {
  res.send('Yo! Just kickstarting cp2');
});
// connect the app to the given port
app.listen(3500, () => {
  console.log('Yo!');
});