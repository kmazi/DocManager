import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import SigninForm from './SigninForm';
import SignUpForm from './SignupForm';

 /**
   * shows or hides the signin form
   * @return {null} returns void
   */
const showSignInForm = () => {
  const signInForm = $('#signinform');
  const signUpForm = $('#signupform');
  signUpForm.slideUp(400, () => {
    signInForm.slideDown(400);
  });
};

/**
   * shows or hides the signup form
   * @return {null} returns void
   */
const showSignUpForm = () => {
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
  signInButtonText, signUpButtonText }) => (
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
        <SigninForm
          history={history}
          signInUser={signInUser}
          signInButtonText={signInButtonText}
        />

        <SignUpForm
          signUserUp={signUserUp}
          history={history}
          signUpButtonText={signUpButtonText}
        />
      </div>
    </div>
);

Authenticate.propTypes = {
  signInButtonText: PropTypes.string.isRequired,
  signUpButtonText: PropTypes.string.isRequired,
  signUserUp: PropTypes.func.isRequired,
  signInUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Authenticate;
