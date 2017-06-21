import path from 'path';
import { createDocument,
        getAllDocuments,
        findDocument } from '../controller/document';

const routes = (router) => {
  // setup path for serving static files
  const sourcePath = path.join(__dirname, '../../client/');
  // route to create a new document
  router.post('/documents', createDocument);
  // route to get all documents
  router.get('/documents', getAllDocuments);
  // route to find a specific document
  router.get('/documents/id', findDocument);

  router.get('/', (req, res) => res.sendFile(`${sourcePath}client.html`));
  router.get('*', (req, res) => {
    res.send('404 error has occured! The page you\'re searching for cannot be found');
  });
};

export default routes;
