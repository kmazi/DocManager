import React from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import parser from 'html-react-parser';

const formatDate = (datetime) => {
  if (datetime) {
    const date = datetime.substring(0, datetime.indexOf('T'));
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }
};

const ReadDocument = ({ title, body, author, modifiedDate, history }) => (
  <div id="readdocument" className="container">
    <h3 className="center-align">{title}</h3>
    <hr />
    <div id="docbody">
      {parser(body)}
    </div><br />
    <div>
      <span>Author: {author}</span><br />
      <span>Modified: {formatDate(modifiedDate)}</span>
    </div><br />
    <button
      className="btn"
      onClick={(event) => {
        event.preventDefault();
        history.push('/user/documents');
      }}
    >back</button>
    <button
      className="btn"
      onClick={(event) => {
        event.preventDefault();
        history.push('/user/documents');
      }}
    >edit</button>
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
