import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signInUser } from '../actions/userActions';

const showSignInForm = () => {
  const signInForm = $('#signinform');
  const signUpForm = $('#signupform');
  signUpForm.slideUp(400, () => {
    signInForm.slideDown(400);
  });
};
const showSignUpForm = () => {
  const signInForm = $('#signinform');
  const signUpForm = $('#signupform');
  signInForm.slideUp(400, () => {
    signUpForm.slideDown(400);
  });
};
const Authenticate = ({ signInButtonText, onSignIn }) => (
  <div className="container">
    <div id="authbuttons" className="row">
      <div className="col s6">
        <span
          className="a center-align waves-effect waves-light btn"
          href="/"
          onClick={() => { showSignInForm(); }}
        >SignIn</span>
      </div>
      <div className="col s6">
        <span
          className="a center-align waves-effect waves-light btn"
          href="/"
          onClick={() => { showSignUpForm(); }}
        >SignUp</span>
      </div>
    </div>

    <div id="authform">
      <div id="signinform" className="">
        <input type="text" className="forminput" placeholder="Username" />
        <input type="password" className="forminput" placeholder="Password" />
        <Link
          id="signinbtn"
          className="center-align waves-effect waves-light btn"
          to="/user/documents"
        >{signInButtonText}</Link>
      </div>

      <div id="signupform" style={{ display: 'none' }}>

        <div className="">
          <input
            className="forminput"
            name="username"
            type="text"
            minLength="3"
            placeholder="Username"
            required
          />
          <input
            className="forminput"
            name="email"
            type="email"
            minLength="10"
            placeholder="Email"
            required
          />
          <input
            className="forminput"
            name="password"
            type="password"
            minLength="6"
            placeholder="Password"
            required
          />
          <input
            className="forminput"
            name="comfirmpassword"
            type="password"
            placeholder="Comfirm password"
            required
          />
          <Link
            id="signinbtn"
            to="/user/documents"
            className="center-align waves-effect waves-light btn"
          >Sign Up</Link>
        </div>

      </div>
    </div>
  </div>
);

Authenticate.propTypes = {
  signInButtonText: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  signInButtonText: state.SignIn.status,
});

const mapDispatchToProps = dispatch => ({
  onSignIn: event => dispatch(signInUser(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
// onClick={(event) => {
//             event.preventDefault();
//             const userName = $('#signinform input[type=text]').val();
//             const password = $('#signinform input[type=password]').val();
//             const formData = { userName, password };
//             onSignIn(formData);
//           }}