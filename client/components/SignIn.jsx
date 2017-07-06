import React from 'react';
import '../styles/materialize-src/sass/materialize.scss';
import '../styles/home.scss';

const signIn = () => (
  <form id="signinform" className="container homescreen">
    <div className="row">
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
      <button
        id="signinbtn"
        className="center-align waves-effect waves-light btn"
      >Sign In</button>
    </div>
  </form>
);
export default signIn;
