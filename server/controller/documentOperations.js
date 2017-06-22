import index from '../models';

/**
 * function to create a document
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const createDocument = (req, res) => {
  const document = index.Document;
  document.findOrCreate({
    where: { title: req.body.title },
    defaults: {
      body: req.body.body,
      access: req.body.access
    }
  }).spread((docCreated, created) => {
    res.status(200).send(created);
  });
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
