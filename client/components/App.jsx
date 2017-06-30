import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { signform, bkgImage } from '../styles/home.scss';
import SignUp from '../containers/SignUp.jsx';
import SignIn from '../containers/SignIn.jsx';
import Routes from '../routes';

const showSignIn = (signInTab) => {
  const signInSpan = $(signInTab);
  signInSpan.click(() => {
    const signInForm = signInSpan.closest('div');
  });
};

const showSignUp = (signUpTab) => {
  $(signUpTab).click(() => {
  });
};

const App = () => {
  const height = {
    height: window.innerHeight || document.documentElement.clientHeight
  };
  return (
    <section style={height} className={bkgImage}>
      <div className="row">
        <h1 className="center-align">DocManager</h1>
        <p className="center-align">
          Welcome to the online document manager.
          Manage all your electronic documents easily.
        </p>
      </div>

      <div className={signform}>
        <div className="row">
          <div className="col s6">
            <span className="center-align" ref={showSignIn} >Sign In</span>
          </div>
          <div className="col s6">
            <span className="center-align" ref={showSignUp} >Sign Up</span>
          </div>
          <SignUp />
        </div>
      </div>
    </section>
  );
};

export default App;
