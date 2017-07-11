import React from 'react';
import { Link } from 'react-router-dom';
import userRoutes from '../userRoutes';

const minHeight = {
  minHeight: window.innerHeight - 153 ||
  document.documentElement.clientHeight - 153
};
const UserDocuments = () => (
  <section className="row">
    <div id="docheader" className="header">
      <div className="row">
        <span className="right">
          <Link to="/">Sign Out</Link>
        </span>
        <span className="right">Welcome Touchstone</span>
      </div>
      <div className="row">
        <div className="col s8 offset-s4">
          <button
            className="center-align waves-effect waves-light btn"
          >Public Docs</button>
          <button
            className="center-align waves-effect waves-light btn"
          >Role Docs</button>
          <button
            className="center-align waves-effect waves-light btn"
          >All Docs</button>
        </div>
      </div>
    </div>

    <div id="doccontent" className="row">
      <div className="col s3 header" style={minHeight}>
        <h3>Dashboard</h3>
        <hr />
        <p>
          Hi Touchstone, you have created 21 documents
        </p>
        <hr />
        <Link to="/user/documents">My docs</Link><br />
        <Link to="/user/documents/createdocument">Create docs</Link><br />
        <Link to="/user/documents/users">View all users</Link>
        <div>
          <input type="text" placeholder="search my documents" />
          <a>search</a>
        </div>
      </div>
      <div id="dashboard" className="col s9">
        <div className="row">
          <a>Search</a>
          <input type="text" placeholder="search my documents" />
        </div>
        <div>
          {userRoutes}
        </div>
      </div>
    </div>

    <footer>DocManager &copy;2017</footer>
  </section>
);
export default UserDocuments;
