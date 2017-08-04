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
  const userId = req.body.user.userId || req.body.userId || '';
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
          status: 'successful',
          documentId: docCreated.id,
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
        message: 'Could not create your document!',
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
        message: 'No document found!',
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
 * function to fetch all documents belonging accessible
 *  to a user from the database
 * @param {object} req - an object that contains the request body
 * @param {object} res - an object that contains the response body
 * @return {null} it returns no value
 */
const getUserDocuments = (req, res) => {
  let access = req.params.access || '';
  const searchParams = req.query;
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset, limit: searchParams.limit };
  }
  const userId = Number(req.params.id);
  if (Number.isInteger(userId) && userId > 0) {
    access = 'Private';
  }
  let searchQuery = {};
  switch (access) {
  case 'Private':
    if (userId === req.body.user.userId) {
      searchQuery = { userId };
    } else {
      searchQuery = null;
    }
    break;
  case 'Public':
    searchQuery = { access };
    break;
  case 'Admin':
  case 'Learning':
  case 'Devops':
  case 'Fellow':
    if (req.body.user.roleType === access) {
      searchQuery = { access };
    } else {
      searchQuery = null;
    }
    break;
  case 'All':
    break;
  default:
    if (req.body.user.roleType !== 'Admin') {
      searchQuery = null;
    }
    break;
  }
  if (searchQuery) {
    document.findAndCountAll({
      where: {
        ...searchQuery,
      },
      attributes: ['id', 'title', 'body', 'userId', 'access', 'createdAt'],
      ...params
    }).then((foundDocuments) => {
      const response = {};
      response.status = 'unsuccessful';
      response.message = 'No document found!';
      res.status(400);
      if (foundDocuments.count > 0 && access === 'All') {
        const finalDocuments = foundDocuments.rows.filter(foundDocument => (
           (foundDocument.userId === req.body.user.userId ||
             foundDocument.access === 'Public' ||
            foundDocument.access === req.body.user.roleType)
        ));
        response.status = 'successful';
        response.message = '';
        response.count = foundDocuments.count;
        response.documents = finalDocuments;
        res.status(200);
        return res.send(response);
      }
      if (foundDocuments.count > 0) {
        response.status = 'successful';
        response.message = '';
        response.count = foundDocuments.count;
        response.documents = foundDocuments.rows;
        res.status(200);
      }
      res.send(response);
    }).catch(() => {
      res.status(500).send({
        status: 'unsuccessful',
        message: 'An error occured while fetching documents!',
      });
    });
  } else {
    return res.status(400).send({
      status: 'unsuccessful',
      message: 'Access denied!',
    });
  }
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
    document.findById(documentId).then((foundDocument) => {
      if (foundDocument) {
        let doc = {};
        switch (foundDocument.access) {
        case 'Private':
          if (foundDocument.userId === req.body.user.userId ||
          req.body.user.roleType === 'Admin') {
            doc = foundDocument;
          }
          break;
        case 'Public':
          doc = req.body.user.userId ? foundDocument : {};
          break;
        case req.body.user.roleType:
          if (foundDocument.access === req.body.user.roleType) {
            doc = foundDocument;
          }
          break;
        default:
          if (req.body.user.roleType === 'Admin') {
            doc = foundDocument;
          } else {
            return res.status(400).send({
              status: 'unsuccessful',
              message: 'Access denied!',
            });
          }
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
        message: 'An error coccured while loading your document!',
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
 * Update a particular document
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const updateDocument = (req, res) => {
  const documentId = Number(req.params.id);
  const userDocument = {};
  if (req.body.title) {
    userDocument.title = req.body.title;
  }
  if (req.body.body) {
    userDocument.body = req.body.body;
  }
  if (req.body.access) {
    userDocument.access = req.body.access;
  }
  document.findById(documentId).then((foundDocument) => {
    if (foundDocument.userId === req.body.user.userId
    || req.body.user.roleType === 'Admin') {
      document.update(userDocument, {
        where: {
          id: documentId,
        }
      }).then(() => {
        if (Object.keys(userDocument).length !== 0) {
          res.status(200).send({
            status: 'successful',
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
          });
        }
      }).catch(() => {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not find any document to update!',
        });
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Restricted document!',
      });
    }
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Could not find any document to update!',
    });
  });
};
/**
 * Searches through documents for a given title
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const searchForDocument = (req, res) => {
  const searchParams = req.query;
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset, limit: searchParams.limit };
  }
  const titleSearchQuery = {
    title: {
      $iLike: `%${req.query.q}%` }
  };
  let searchQuery = req.body.user.roleType === 'Admin' ?
  titleSearchQuery : { $or:
  [{ userId: req.body.user.userId, ...titleSearchQuery },
    { access: req.body.user.roleType, ...titleSearchQuery },
    { access: 'Public', ...titleSearchQuery }] };

  if (!req.query.q) {
    searchQuery = req.body.user.roleType === 'Admin' ?
    {} : { $or:
    [{ userId: req.body.user.userId },
    { access: req.body.user.roleType },
    { access: 'Public' }] };
  }
  document.findAndCountAll({
    where: { ...searchQuery },
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
        message: 'No match found!',
      });
    }
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Unable to get document(s)',
    });
  });
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
  response.status = 'unsuccessful';
  document.findById(documentId).then((knownDocument) => {
    if (!knownDocument) {
      response.status = 'unsuccessful';
      response.message = 'Could not find document!';
      return res.status(400).send(response);
    } else if (knownDocument.userId === req.body.user.userId) {
      knownDocument.destroy().then(() => {
        response.status = 'successful';
        response.message = `"${knownDocument.title}" has been deleted!`;
        return res.status(200).send(response);
      }).catch(() => {
        response.status = 'unsuccessful';
        response.message = 'Could not delete the document!';
        return res.status(400).send(response);
      });
    } else {
      response.status = 'unsuccessful';
      response.message = 'Access denied!';
      return res.send(response);
    }
  }).catch(() => {
    response.status = 'unsuccessful';
    response.message = 'No document found!';
    return res.status(400).send(response);
  });
};

export { createDocument, getAllDocuments, findDocument,
  deleteDocument, getUserDocuments, searchForDocument,
  updateDocument };
