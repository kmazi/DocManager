import React from 'react';
import $ from 'jquery';

const signIn = () => (
  <div id="signinform" className="container hide">
    <div className="row">
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
      <button id="signinbtn">Sign In</button>
    </div>
  </div>
);
export default signIn;
