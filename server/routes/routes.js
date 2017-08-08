import { signUpValidation,
         signInValidation,
         verifyToken,
         allowOnlyAdmin,
         allowOnlySuperAdmin } from '../middlewares/validation';
import Controllers from '../controller';

const Roles = Controllers.Roles;
const Users = Controllers.Users;
const Documents = Controllers.Documents;
/**
 * Creates the document model
 * @param {object} router - represents router object from express to use
 * @param {object} compiler - contains information in the webpack
 * @return {null} returns void
 */
const routes = (router) => {
  // route to create a new user
  router.post('/users', signUpValidation, Users.signUp);
  // route to signin a user
  router.post('/users/login', signInValidation, Users.signIn);

  router.use(verifyToken);
  // Update a specific user
  router.put('/users/:id', Users.update);
  // route to create role
  router.post('/role', allowOnlySuperAdmin, Roles.create);
  // Find a specific user
  router.get('/users/:userId', Users.viewProfile);
  // route to get all users and paginate them
  router.get('/users', allowOnlyAdmin, Users.getAll);
  // Deletes a specific user
  router.delete('/users/:id', allowOnlyAdmin, Users.delete);
  // route to search for users
  router.get('/search/users', allowOnlyAdmin, Users.find);
  // route to fetch documents belonging to a user
  // router.get('/users/:id/documents', getUserDocuments);
  router.get('/users/:id/documents', Documents.getUserDocuments);
  // route to search for documents
  router.get('/search/documents', Documents.search);
  // route to find a specific document
  router.get('/document/:id', Documents.find);
  // route to get access required documents
  router.get('/documents/:access', Documents.getAll);
  // route to get all documents
  router.get('/documents', allowOnlyAdmin, Documents.getAll);
  // route to create a new document
  router.post('/documents', Documents.create);
  // route to update a specific document
  router.put('/documents/:id', Documents.update);

  // route to delete a specific document
  router.delete('/documents/:id', Documents.delete);
};

export default routes;
