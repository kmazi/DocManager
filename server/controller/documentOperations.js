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
  const access = req.body.access;
  if (title === '' || body === '' || access === '') {
    res.status(422).send('Validation error!');
  } else {
    document.findOrCreate({
      where: { title },
      defaults: {
        body,
        access
      }
    }).spread((docCreated, created) => {
      res.status(200).send(created);
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
 * function to fetch a specific document from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const findDocument = (req, res) => {

};

export { createDocument, getAllDocuments, findDocument };
