import React from 'react';
import propTypes from 'prop-types';

import Search from '../container/Search';

/**
 * Template to render documents from store
 * @return {object} returns html object to render
 */
const DocumentPreview = ({ userDocuments }) => {
  const docs = userDocuments.map(document => (
    <div id="docview" key={document.id} className="col s3">
      <div>
        <h6 className="center-align">
          {document.title}</h6>
        <hr />
        <i
          className="docicon fa fa-file-text center-align"
          aria-hidden="true"
        />
        <br />
        <button id={document.id}>Read&nbsp;
          <i className="fa fa-envelope-o" aria-hidden="true" />
        </button>
        <button id={document.id}>Delete&nbsp;
          <i className="fa fa-trash" aria-hidden="true" />
        </button>
      </div>
    </div>));
  return (
    <div className="row">
      <Search />
      {docs}
    </div>);
};

DocumentPreview.propTypes = {
  userDocuments: propTypes.array.isRequired,
};

export default DocumentPreview;
