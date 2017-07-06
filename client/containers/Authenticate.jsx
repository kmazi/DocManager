import React from 'react';
import SignIn from '../components/SignIn.jsx';
import SignUp from '../components/SignUp.jsx';

const Authenticate = () => {
  let displaySignUp = true;
  let displaySignIn = false;

  return (
    <div>
      <div>
        <div>
          <a href="/">SignUp</a>
        </div>
        <div>
          <a href="/">SignIn</a>
        </div>
      </div>
      <div>
        <SignIn />
        <SignUp />
      </div>
    </div>
  );
};

export default Authenticate;
