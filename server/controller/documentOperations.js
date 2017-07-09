import index from '../models';

const document = index.Document;
/**
 * function to create a document
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {boolean} it returns true if the document was created
 * and false otherwise
 */
const createDocument = (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const userId = req.body.userId;
  const access = req.body.access;
  // Don't create document if fields are empty
  if (title === '' || body === '' || access === '') {
    res.send({
      status: 'unsuccessful',
      message: 'Empty title or body or access field!',
    });
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
        res.send({
          status: 'successful'
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message: 'Could not create the document!',
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
  const userId = req.params.id;
  document.findAndCountAll({
    where: {
      userId,
    },
  }).then((documents) => {
    if (documents.count > 0) {
      res.send({
        status: 'successful',
        documents: documents.rows
      });
    } else {
      res.send({
        status: 'unsuccessful',
        message: 'No document was found',
      });
    }
  }).catch(() => {
    res.send({
      status: 'unsuccessful',
      message: 'Could not fetch all your documents!',
    });
  });
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
