import React from 'react';
import propTypes from 'prop-types';
import Alert from 'sweetalert2';

import Search from '../container/Search';

const deleteDocById = (deleteDocument, docId) => {
  deleteDocument(docId, localStorage.getItem('docmanagertoken'))
    .then((res) => {
      if (res.status === 'successful') {
        Alert({
          title: 'Delete successful',
          text: res.message,
          type: 'success',
          confirmButtonText: 'ok'
        });
      } else {
        Alert({
          title: 'Error loading document',
          text: res.message,
          type: 'error',
          confirmButtonText: 'ok'
        });
      }
    });
};
/**
 * Template to render documents from store
 * @return {object} returns html object to render
 */
const DocumentPreview = ({ userDocuments, readDocument,
  read, deleteId, history, deleteDocument }) => {
  const docs = userDocuments.map(document => (<div
    id="docview"
    key={document.id}
    className="col s3"
  >
    <div>
      <h6 className="center-align">
        {document.title}</h6>
      <hr />
      <i
        className="docicon fa fa-file-text center-align"
        aria-hidden="true"
      />
      <br />
      <button
        id={document.id}
        onClick={(event) => {
          event.preventDefault();
          readDocument(document.id, localStorage.getItem('docmanagertoken'))
            .then((res) => {
              if (res.status === 'successful') {
                history.push('/user/documents/read');
              } else {
                Alert({
                  title: 'Error loading document',
                  text: res.message,
                  type: 'error',
                  confirmButtonText: 'ok'
                });
              }
            });
        }}
      >{read === document.id ? 'Opening' : 'Read'}&nbsp;
        <i className="fa fa-envelope-o" aria-hidden="true" />
      </button>
      <button
        id={document.id}
        onClick={(event) => {
          event.preventDefault();
          deleteDocById(deleteDocument, document.id);
        }}
      >{deleteId === document.id ? 'Deleting' : 'Delete'}&nbsp;
        <i className="fa fa-trash" aria-hidden="true" />
      </button>
    </div>
  </div>)
  );
  return (
    <div className="row">
      <Search />
      <div>
        {docs}
      </div>
    </div>);
};

DocumentPreview.propTypes = {
  userDocuments: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.string.isRequired,
      id: propTypes.number.isRequired,
    })
  ).isRequired,
  readDocument: propTypes.func.isRequired,
  deleteDocument: propTypes.func.isRequired,
  read: propTypes.number.isRequired,
  deleteId: propTypes.number.isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
};

export default DocumentPreview;
