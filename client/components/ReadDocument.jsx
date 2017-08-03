import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import parser from 'html-react-parser';

const ReadDocument = ({ title, body, author, modifiedDate, history }) => (
  <div className="row">
    <p>{title}</p>
    {parser(body)}
    <div>
      <span>Author: {author}</span><br />
      <span>Modified: {modifiedDate}</span>
    </div>
    <button onClick={(event) => {
      event.preventDefault();
      history.push('/user/documents');
    }}
    >ok</button>
  </div>
);

ReadDocument.propTypes = {
  title: propTypes.string.isRequired,
  body: propTypes.string.isRequired,
  author: propTypes.string.isRequired,
  modifiedDate: propTypes.string.isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  title: state.readDocument.document.title,
  body: state.readDocument.document.body,
  author: state.readDocument.document.author,
  modifiedDate: state.readDocument.document.updatedAt,
});
export default connect(mapStateToProps)(withRouter(ReadDocument));
