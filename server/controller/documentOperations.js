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
  const title = req.body.title || '';
  const body = req.body.body || '';
  const userId = req.body.userId || '';
  const access = req.body.access || '';
  // Don't create document if fields are empty
  if (title === '' || body === '' || access === '' || userId === '') {
    res.status(400).send({
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
        res.status(200).send({
          status: 'successful'
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Document already exist!',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not create the document!',
      });
    });
  }
};
const getAccessLevelDocuments = (req, res) => {
  const searchParams = req.query;
  const access = { access: req.params.access || '' };
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset,
      limit: searchParams.limit };
  }
  document.findAndCountAll({
    where: { ...access },
    attributes: ['id', 'title', 'body', 'access', 'createdAt'],
    ...params
  }).then((documents) => {
    if (documents.count > 0) {
      res.status(200).send({
        status: 'successful',
        count: documents.count,
        documents: documents.rows,
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No documents found!',
      });
    }
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Could not fetch all documents!',
    });
  });
};
/**
 * function to fetch all documents from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getAllDocuments = (req, res) => {
  const searchParams = req.query;
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset, limit: searchParams.limit };
  }
  document.findAndCountAll({
    attributes: ['id', 'title', 'body', 'access', 'createdAt'],
    ...params
  }).then((documents) => {
    if (documents.count > 0) {
      res.status(200).send({
        status: 'successful',
        count: documents.count,
        documents: documents.rows,
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No documents found!',
      });
    }
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Could not fetch all documents!',
    });
  });
};
/**
 * function to fetch all documents belonging to a user from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getUserDocuments = (req, res) => {
  const userId =
    (req.params.id > 0 && Number.isInteger(Number(req.params.id))) ?
      req.params.id : 0;
  document.findAndCountAll({
    where: {
      userId,
    },
  }).then((documents) => {
    if (documents.count > 0) {
      res.status(200).send({
        status: 'successful',
        documents: documents.rows,
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'No document was found',
      });
    }
  }).catch(() => {
    res.status(400).send({
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
  const documentId = Number(req.params.id);
  if (Number.isInteger(documentId) && documentId > 0) {
    // foundDocument.userId !== req.body.user.userId && foundDocument
    document.findById(documentId).then((foundDocument) => {
      if (foundDocument) {
        let doc = {};
        switch (foundDocument.access) {
        case 'Private':
          if (foundDocument.userId === req.body.user.userId) {
            doc = foundDocument;
          }
          break;
        case 'Public':
          doc = foundDocument;
          break;
        case req.body.user.roleType:
          if (foundDocument.access === req.body.user.roleType) {
            doc = foundDocument;
          }
          break;
        default:
          return res.status(400).send({
            status: 'unsuccessful',
            message: 'Access denied',
          });
        }
        res.status(200).send({
          status: 'successful',
          document: doc,
        });
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not find any document!',
        });
      }
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not find any document!',
      });
    });
  } else {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Invalid search parameter!',
    });
  }
};

/**
 * Delete a specific document
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const deleteDocument = (req, res) => {
  const documentId = Number(req.params.id);
  const response = {};
  if (Number.isInteger(documentId) && documentId > 0) {
    document.findById(documentId).then((knownDocument) => {
      if (!knownDocument) {
        response.status = 'unsuccessful';
        response.message = 'Could not find any document!';
        return res.send(response);
      } else if (knownDocument.userId === req.body.user.userId) {
        knownDocument.destroy().then(() => {
          response.status = 'successful';
          response.message = `"${knownDocument.title}" has been deleted!`;
          return res.send(response);
        }).catch(() => {
          response.status = 'unsuccessful';
          response.message = 'Could not delete the document!';
          return res.send(response);
        });
      } else {
        response.status = 'unsuccessful';
        response.message = 'Access denied!';
        return res.send(response);
      }
    }).catch(() => {
      response.status = 'unsuccessful';
      response.message = 'No document found!';
      return res.send(response);
    });
  } else {
    response.status = 'unsuccessful';
    response.message = 'Invalid user id!';
    return res.send(response);
  }
};

export { createDocument, getAllDocuments, findDocument, getUserDocuments,
  deleteDocument, getAccessLevelDocuments };
