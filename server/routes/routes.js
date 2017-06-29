import path from 'path';
import { createDocument,
        getAllDocuments,
        findDocument } from '../controller/documentOperations';

const routes = (router, compiler) => {
  // setup path for serving static files
  const sourcePath = path.join(__dirname, '../../client/');
  // route that serves the home page
  // router.get('/', (req, res) => res.sendFile(`${sourcePath}index.html`));
  router.get('/', (req, res, next) => {
    const filename = path.join(sourcePath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if(err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    })
  });
  // route to create a new document
  router.post('/documents', createDocument);
  // route to get all documents
  router.get('/documents', getAllDocuments);
  // route to find a specific document
  router.get('/documents/id', findDocument);

  router.get('*', (req, res) => {
    res.status(404).send(`404 error has occured! The page you're 
      searching for cannot be found`);
  });
};

export default routes;
