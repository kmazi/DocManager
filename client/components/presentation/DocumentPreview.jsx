import React from 'react';
import propTypes from 'prop-types';
import Alert from 'sweetalert2';
import $ from 'jquery';
import Pagination from 'react-js-pagination';

import Search from '../container/Search';

const deleteDocById = (deleteDocument, docId) => {
  deleteDocument(docId)
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

const getDocument = (pageNumber, paginateDocument, documentAccess) => {
  const offSet = (pageNumber - 1) * 8;
  const searchText = $('.searchcontainer input').val();
  paginateDocument(pageNumber, offSet, documentAccess, searchText);
};
/**
 * Template to render documents from store
 * @return {object} returns html object to render
 */
const DocumentPreview = ({ userDocuments, readDocument,
  read, deleteId, history, deleteDocument, paginateDocument,
  documentAccess, currentPage, documentsCount }) => {
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
      <div className="row">
        {docs}
      </div>
      <div className="row">
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={8}
          totalItemsCount={documentsCount}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => {
            getDocument(pageNumber, paginateDocument, documentAccess);
          }}
        />
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
