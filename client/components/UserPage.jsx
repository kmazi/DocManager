import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import userRoutes from '../userRoutes';

import { publicDocuments,
  roleDocuments,
  allDocuments } from '../actions/documentActions';

const minHeight = {
  minHeight: window.innerHeight - 153 ||
  document.documentElement.clientHeight - 153
};
const token = localStorage.getItem('docmanagertoken');
const signOut = (event, history) => {
  event.preventDefault();
  if (token) {
    localStorage.removeItem('docmanagertoken');
  }
  history.push('/');
};

const UserPage = ({ userName, history, isAuthentic,
  getPublicDocuments, getRoleDocuments, getAllDocuments }) => (
    <section className="row">
      <div id="docheader" className="header">
        <span className="left">DocManager</span>
        <span className="right">
          <a
            href="/"
            onClick={(event) => {
              signOut(event, history);
            }}
          >Hi {userName}! Sign Out</a>
        </span>
        <div className="row">
          <div className="col m10 offset-m2">
            <button
              name="public"
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                getPublicDocuments(token, isAuthentic, history);
              }}
            >Public Documents&nbsp;
            <i className="fa fa-file-text-o" aria-hidden="true" /></button>
            <button
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                getRoleDocuments(token, isAuthentic, history);
              }}
            >Role Documents&nbsp;
              <i className="fa fa-file-archive-o" aria-hidden="true" /></button>
            <button
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                getAllDocuments(token, isAuthentic, history);
              }}
            >All Documents&nbsp;
            <i className="fa fa-file-archive-o" aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div id="doccontent" className="row">
        <div className="col m2 header" style={minHeight}>
          <h5>Dashboard</h5>
          <hr />
          <p>
            Hi {userName} , you have created documents
          </p>
          <hr />
          <Link to="/user/documents">My docs</Link><br />
          <Link to="/user/documents/createdocument">Create docs</Link><br />
          <Link to="/user/documents/users">View all users</Link>
          <div>
            <input type="text" placeholder="search own documents" />
            <a>search</a>
          </div>
        </div>
        <div id="dashboard" className="col m10">
          <div className="row">
            <div className="col s8">
              <input type="text" placeholder="search my documents" />
            </div>
            <div className="col s2">
              <i className="fa fa-search-plus small" aria-hidden="true">Search</i>
            </div>
          </div>
          <div>
            {userRoutes}
          </div>
        </div>
      </div>

      <footer>DocManager &copy;2017</footer>
    </section>
);

UserPage.propTypes = {
  userName: propTypes.string.isRequired,
  isAuthentic: propTypes.bool.isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
  getPublicDocuments: propTypes.func.isRequired,
  getRoleDocuments: propTypes.func.isRequired,
  getAllDocuments: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userName: state.authenticateUser.userName,
});

const mapDispatchToProps = dispatch => ({
  getPublicDocuments: (userToken, isAuthentic, history) => {
    dispatch(publicDocuments(userToken, isAuthentic, history));
  },
  getRoleDocuments: (userToken, isAuthentic, history) => {
    dispatch(roleDocuments(userToken, isAuthentic, history));
  },
  getAllDocuments: (userToken, isAuthentic, history) => {
    dispatch(allDocuments(userToken, isAuthentic, history));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
