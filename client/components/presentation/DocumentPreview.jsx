import React from 'react';
import propTypes from 'prop-types';
import Alert from 'sweetalert2';
import $ from 'jquery';
import Pagination from 'react-js-pagination';

import Search from '../container/Search';

/**
 * Deletes a document from the database
 * @param {func} deleteDocument - Function that fires when deleting a document
 * @param {number} docId - The ID of the document to delete
 * @return {null} returns void
 */
const deleteDocById = (deleteDocument, docId) => {
  Alert({
    title: 'Comfirm deactivation',
    text: 'Are you sure you want to this document?',
    type: 'info',
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText:
      '<i class="fa fa-thumbs-up"></i> Yes!',
    cancelButtonText:
      '<i class="fa fa-thumbs-down"></i> No',
    showLoaderOnConfirm: true,
    preConfirm: () => new Promise((resolve, reject) => {
      deleteDocument(docId)
      .then((res) => {
        if (res.status === 'successful') {
          resolve();
        } else {
          reject();
        }
      });
    }),
    allowOutsideClick: false
  }).then(() => {
    Alert({
      type: 'success',
      title: 'Delete successful!',
    });
  });
};

/**
 * Fetches a particular document from the database
 * @param {number} pageNumber - The current page number
 * @param {func} paginateDocument - The function that gets
 * executed when paginating documents
 * @param {string} documentAccess - The access level of the document
 * @return {null} returns void
 */
const getDocument = (pageNumber, paginateDocument,
  documentAccess, roleType, userId) => {
  const offSet = (pageNumber - 1) * 8;
  const searchText = $('.searchcontainer input').val();
  paginateDocument(pageNumber, offSet, documentAccess, searchText,
    roleType, userId);
};
/**
 * Template to render documents from store
 * @return {object} returns html object to render
 */
const DocumentPreview = ({ userDocuments, readDocument,
  read, deleteId, history, deleteDocument, paginateDocument,
  documentAccess, currentPage, documentsCount,
  roleType, userId }) => {
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
        className={userId === document.userId || roleType === 'Admin'
        ? '' : 'hide'}
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
      <div className={documentsCount > 8 ? 'row' : 'row hide'}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={8}
          totalItemsCount={documentsCount}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => {
            getDocument(pageNumber, paginateDocument, documentAccess,
            roleType, userId);
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
  roleType: propTypes.string.isRequired,
  userId: propTypes.number.isRequired,
  paginateDocument: propTypes.func.isRequired,
  readDocument: propTypes.func.isRequired,
  deleteDocument: propTypes.func.isRequired,
  documentsCount: propTypes.number.isRequired,
  documentAccess: propTypes.string.isRequired,
  read: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  deleteId: propTypes.number.isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
};

export default DocumentPreview;
