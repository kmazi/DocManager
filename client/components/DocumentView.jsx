import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import DocumentPreview from './DocumentPreview';

const DocumentView = ({ documents, shouldDisplay, documentStatus }) => {
  const finalRender = (shouldDisplay) ?
    <DocumentPreview userDocuments={documents} /> :
    <p>{documentStatus}</p>;
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

const mapStateToProps = state => ({
  id: state.authenticateUser.userId,
  documents: state.fetchDocuments.documents,
  shouldDisplay: state.fetchDocuments.isReady,
  documentStatus: state.fetchDocuments.status,
});

DocumentView.propTypes = {
  documentStatus: propTypes.string.isRequired,
  documents: propTypes.array.isRequired,
  shouldDisplay: propTypes.bool.isRequired,
};

export default connect(mapStateToProps)(DocumentView);
