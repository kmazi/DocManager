import React from 'react';
import $ from 'jquery';


const signUserUp = (event) => {
  event.preventDefault();
  const userName = $('input[name=username]').val();
  const email = $('input[name=email]').val();
  const password = $('input[name=password]').val();
  const comfirmPassword = $('input[name=comfirmpassword]').val();
  const userInfo = { userName, email };
  if (password === comfirmPassword) {
    userInfo.password = password;
  } else {
    userInfo.password = '';
  }
};

const SignUp = () => (
  <div id="signupform" className="hide">
    <form onSubmit={signUserUp}>
      <div className="row">
        <input
          name="username"
          type="text"
          minLength="3"
          placeholder="Username"
          required
        />
        <input
          name="email"
          type="email"
          minLength="10"
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          minLength="6"
          placeholder="Password"
          required
        />
        <input
          name="comfirmpassword"
          type="password"
          placeholder="Comfirm password"
          required
        />
        <button name="submit" id="submit" type="submit">Sign Up</button>
      </div>
    </form>
  </div>
);
export default SignUp;
