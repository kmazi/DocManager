import path from 'path';
import { createDocument,
         getAllDocuments,
         findDocument,
         getUserDocuments } from '../controller/documentOperations';
import { signUpValidation,
         signInValidation } from '../controller/middlewares/validation';
import { signUpUser,
         signInUser,
         getAllUsers,
         findUser,
         updateUser,
         deleteUser } from '../controller/userOperation';
/**
 * Creates the document model
 * @param {object} router - represents router object from express to use
 * @param {object} compiler - contains information in the webpack
 * @return {null} returns void
 */
const routes = (router, compiler) => {
  // setup path for serving static files
  const sourcePath = path.join(__dirname, '../../client/');
  // route to get all users and paginate them
  router.get('/users', getAllUsers);
  // Find a specific user
  router.get('/users/:id', findUser);
  // Update a specific user
  router.put('/users/:id', signUpValidation, updateUser);
  // Deletes a specific user
  router.delete('/users/:id', deleteUser);
  // route to signin a user
  router.get('/users/signin', signInValidation, signInUser);
  // route to create a new user
  router.post('/users', signUpValidation, signUpUser);
  // route to fetch documents belonging to a user
  router.get('/users/:id/documents', getUserDocuments);
  // route to get all documents
  router.get('/documents', getAllDocuments);
  // route to create a new document
  router.post('/documents', createDocument);
  // route to find a specific document
  router.get('/documents/:id', findDocument);
  // route that serves the home page
  // router.get('/', (req, res) => res.sendFile(`${sourcePath}index.html`));
  router.get('/', (req, res, next) => {
    const filename = path.join(sourcePath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
// Default route when ther is no match
  router.get('*', (req, res) => {
    res.status(404).send(`404 error! The page you're 
      searching for cannot be found`);
  });
};

export default routes;
