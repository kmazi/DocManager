import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'sweetalert2';
import $ from 'jquery';

/**
 * Fires the function that authenticates a user
 * @param {object} event - object containing data about the control that
 * triggered an event
 * @param {func} signUserUp - function that executes when signing users up
 * @param {object} history - the browser and app state history
 * @param {func} getUserDocuments - Function that executes when
   * fetching documents belonging to a particular user
 * @return {null} returns void
 */
const signUp = (event, signUserUp, history, getUserDocuments) => {
  event.preventDefault();
  const userName = $('#signupform input[name=username]').val();
  const email = $('#signupform input[type=email]').val();
  const password = $('#signupform input[type=password]').val();
  const comfirmPassword = $('#signupform input[type=password]').val();
  const roleId = $('#signupform input[name=group1]:checked').val();
  const formData = { userName, email, password, comfirmPassword, roleId };
  signUserUp(formData)
    .then((res) => {
      if (res.status === 'successful') {
        history.push('/user/documents');
        getUserDocuments(res.data.userId, res.data.token);
      } else {
        Alert({
          title: 'Error Signing up',
          text: res.message,
          type: 'error',
          confirmButtonText: 'ok'
        });
      }
    });
};
/**
 * Renders form for signin up new user
 * @return {object} Returns the signup form to render
 */
const SignupForm = ({ signUserUp, history,
  signUpButtonText, getUserDocuments }) => (
    <div id="signupform" style={{ display: 'none' }}>
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
      <div id="roles">
        Role:&nbsp;&nbsp;
        <input
          className="with-gap"
          name="group1"
          type="radio"
          id="Learning"
          value="2"
        />
        <label htmlFor="Learning">Learning</label>
        <input
          className="with-gap"
          name="group1"
          type="radio"
          id="Fellow"
          value="1"
        />
        <label htmlFor="Fellow">Fellow</label>
        <input
          className="with-gap"
          name="group1"
          type="radio"
          id="DevOps"
          value="3"
        />
        <label htmlFor="DevOps">DevOps</label><br />
      </div>
      <button
        id="signinbtn"
        className="center-align waves-effect waves-light btn"
        onClick={event => signUp(event, signUserUp, history, getUserDocuments)}
      >{signUpButtonText}</button>
    </div>
);

SignupForm.propTypes = {
  signUserUp: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  signUpButtonText: PropTypes.string.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
};
export default SignupForm;
