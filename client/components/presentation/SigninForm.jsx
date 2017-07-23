import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Alert from 'sweetalert2';


/**
   * Fires the function that authenticates a user
   * @param {object} event - object containing data about the control that
   * triggered an event
   * @param {object} history - The browser and state history
   * @param {func} signInUser - Function that executes when signing the user in
   * @return {null} returns void
   */
const signUserIn = (event, history, signInUser) => {
  // prevent the default behaviour of the button
  event.preventDefault();
  // Get the input values
  const userName = $('#signinform input[type=text]').val();
  const password = $('#signinform input[type=password]').val();
  const formData = { userName, password };
  // consume the returned promise
  signInUser(formData)
    .then((res) => {
      if (res.status === 'successful') {
        history.push('/user/documents');
      } else {
        Alert({
          title: 'Error Signing in',
          text: res.message,
          type: 'error',
          confirmButtonText: 'ok'
        });
      }
    });
};
/**
 * Renders the signin form
 * @param {object} history - Represent the browser and app state history object
 * @param {bool} isAuthentic - Value that shows if user is loggin in
 * @param {func} signInUser - Function that executes when signing in a user
 * @return {object} Returns the signin form to render
 */
const SigninForm = ({ history, signInUser,
  signInButtonText }) => (
    <div id="signinform" className="">
      <input type="text" className="forminput" placeholder="Username" />
      <input type="password" className="forminput" placeholder="Password" />
      <button
        id="signinbtn"
        className="center-align waves-effect waves-light btn"
        onClick={event =>
          signUserIn(event, history, signInUser)}
      >{signInButtonText}</button>
    </div>
);

SigninForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  signInUser: PropTypes.func.isRequired,
  signInButtonText: PropTypes.string.isRequired,
};
export default SigninForm;
