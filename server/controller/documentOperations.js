import index from '../models';

/**
 * function to create a document
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {boolean} it returns true if the document was created
 * and false otherwise
 */
const createDocument = (req, res) => {
  const document = index.Document;
  const title = req.body.title;
  const body = req.body.body;
  const userId = req.body.userId;
  const access = req.body.access;
  // Don't create document if fields are empty
  if (title === '' || body === '' || access === '') {
    res.send('Empty title or body or access field!');
  } else {
    // check to see if document with same title exist before creation
    document.findOrCreate({
      where: { title },
      defaults: {
        body,
        access,
        userId
      }
    }).spread((docCreated, isCreated) => {
      if (isCreated) {
        res.send('successful');
      }
    }).catch((err) => {
      res.send({
        status: 'unsuccessful',
        err
      });
    });
  }
};
/**
 * function to fetch all documents from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getAllDocuments = (req, res) => {

};
/**
 * function to fetch all documents belonging to a user from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getUserDocuments = (req, res) => {
  
};
/**
 * function to fetch a specific document from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const findDocument = (req, res) => {

};

export { createDocument, getAllDocuments, findDocument, getUserDocuments };
