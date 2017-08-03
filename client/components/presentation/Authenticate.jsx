import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import SigninForm from './SigninForm';
import SignUpForm from './SignupForm';

 /**
   * shows or hides the signin form
   * @param {object} event - Contains information about the button clicked
   * @return {null} returns void
   */
const showSignInForm = (event) => {
  event.preventDefault();
  const signInForm = $('#signinform');
  const signUpForm = $('#signupform');
  signUpForm.slideUp(400, () => {
    signInForm.slideDown(400);
  });
};

/**
   * shows or hides the signup form
   * @param {object} event - Contains information about the button clicked
   * @return {null} returns void
   */
const showSignUpForm = (event) => {
  event.preventDefault();
  const signInForm = $('#signinform');
  const signUpForm = $('#signupform');
  signInForm.slideUp(400, () => {
    signUpForm.slideDown(400);
  });
};

/**
 * Renders the authentication form
 * @return {object} Returns the authentication form to render
 */
const Authenticate = ({ history, signInUser, signUserUp,
  submitButton, getUserDocuments }) => (
    <div className="container">
      <div id="authbuttons" className="row">
        <div className="col s6">
          <span
            className="a center-align waves-effect waves-light btn"
            href="/"
            onClick={(event) => { showSignInForm(event); }}
          >SignIn</span>
        </div>
        <div className="col s6">
          <span
            className="a center-align waves-effect waves-light btn"
            href="/"
            onClick={(event) => { showSignUpForm(event); }}
          >SignUp</span>
        </div>
      </div>

      <div id="authform">
        <SigninForm
          history={history}
          signInUser={signInUser}
          signInButtonText={submitButton}
          getUserDocuments={getUserDocuments}
          submitButton={submitButton}
        />

        <SignUpForm
          signUserUp={signUserUp}
          history={history}
          signUpButtonText={submitButton}
          getUserDocuments={getUserDocuments}
          submitButton={submitButton}
        />
      </div>
    </div>
);

Authenticate.propTypes = {
  submitButton: PropTypes.string.isRequired,
  signUserUp: PropTypes.func.isRequired,
  signInUser: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Authenticate;
