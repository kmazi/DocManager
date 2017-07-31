import React from 'react';
import propTypes from 'prop-types';

import DocumentPreview from './DocumentPreview';

const DocumentView = ({ documents, shouldDisplay, read, deleteId,
  documentStatus, readDocument, history, deleteDocument }) => {
  const finalRender = (shouldDisplay) ?
    (<DocumentPreview
      userDocuments={documents}
      read={read}
      deleteId={deleteId}
      readDocument={readDocument}
      history={history}
      deleteDocument={deleteDocument}
    />) :
    <p id="status" className="center-align">{documentStatus}</p>;
  /**
 * Renders the html elements on the browser
 * @return {object} Returns the html object to render
 */
  return (// Render documents if successsfully loaded from server
    // else show loading message
    <div id="doc-view-background" >
      {finalRender}
    </div>);
};

DocumentView.propTypes = {
  documentStatus: propTypes.string.isRequired,
  documents: propTypes.arrayOf(propTypes.shape()).isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
  readDocument: propTypes.func.isRequired,
  deleteDocument: propTypes.func.isRequired,
  read: propTypes.number.isRequired,
  deleteId: propTypes.number.isRequired,
  shouldDisplay: propTypes.bool.isRequired,
};

export default DocumentView;
