import path from 'path';

const routes = (router) => {
  // Setup a default catch-all route that sends back a welcome message in JSON format.
  const sourcePath = path.join(__dirname, '../../client/');
  router.get('/', (req, res) => res.sendFile(`${sourcePath}client.html`));
  router.get('*', (req, res) => {
    res.send('404 error has occured! The page you\'re searching for cannot be found');
  });
};

export default routes;
