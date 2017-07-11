import React from 'react';
import { Link } from 'react-router-dom';

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
      <div className="col s3 header">

      </div>
      <div id="dashboard" className="col s9">
        <div className="row">
          <input type="text" placeholder="search my documents" />
          <a>Search</a>
        </div>
      </div>
    </div>
    
    <footer>DocManager &copy;2017</footer>
  </section>
);
export default UserDocuments;
