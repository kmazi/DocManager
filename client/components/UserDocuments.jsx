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

const UserDocuments = ({ userName, history, isAuthentic,
  getPublicDocuments, getRoleDocuments, getAllDocuments }) => (
  <section className="row">
    <div id="docheader" className="header">
      <div className="row">
        <span className="right">
          <Link to="/">Sign Out</Link>
        </span>
        <span className="right">Hi {userName}</span>
      </div>
      <div className="row">
        <div className="col m10 offset-m2">
          <button
            className="center-align waves-effect waves-light btn"
            onClick={(event) => {
              event.preventDefault();
              getPublicDocuments(token, isAuthentic, history);
            }}
          >Public Docs</button>
          <button
            className="center-align waves-effect waves-light btn"
            onClick={(event) => {
              event.preventDefault();
              getRoleDocuments(token, isAuthentic, history);
            }}
          >Role Docs</button>
          <button
            className="center-align waves-effect waves-light btn"
            onClick={(event) => {
              event.preventDefault();
              getAllDocuments(token, isAuthentic, history);
            }}
          >All Docs</button>
        </div>
      </div>
    </div>

    <div id="doccontent" className="row">
      <div className="col m2 header" style={minHeight}>
        <h4>Dashboard</h4>
        <hr />
        <p>
          Hi {userName} , you have created documents
        </p>
        <hr />
        <button>My docs</button>
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

UserDocuments.propTypes = {
  userName: propTypes.string.isRequired,
  isAuthentic: propTypes.bool.isRequired,
  history: propTypes.object.isRequired,
  getPublicDocuments: propTypes.func.isRequired,
  getRoleDocuments: propTypes.func.isRequired,
  getAllDocuments: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userName: state.authenticateUser.userName,
  isAuthentic: state.authenticateUser.isAuthenticated,
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
export default connect(mapStateToProps, mapDispatchToProps)(UserDocuments);
