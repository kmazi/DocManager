import React from 'react';
import PropTypes from 'prop-types';
import SignIn from '../components/SignIn.jsx';
import SignUp from '../components/SignUp.jsx';

const Authenticate = () => {
  return (
    <div className="container">
      <div id="authbuttons" className="row">
        <div className="col s6">
          <span
            className="a center-align waves-effect waves-light btn"
            href="/"
          >SignIn</span>
        </div>
        <div className="col s6">
          <span
            className="a center-align waves-effect waves-light btn"
            href="/"
          >SignUp</span>
        </div>
      </div>
      <div>
        <SignIn />
      </div>
    </div>
  );
};
export default Authenticate;
