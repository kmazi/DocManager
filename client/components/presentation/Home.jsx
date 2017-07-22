import React from 'react';
import Authenticate from '../container/Authenticate';

const home = () => (
  <div className="row homescreen">
    <h1 className="center-align">DocManager</h1>
    <p className="center-align">
      Create, secure and access documents
      from anywhere in the world.
    </p>
    <Authenticate />
  </div>
  );
export default home;
