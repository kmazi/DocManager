import React from 'react';
import Authenticate from '../containers/Authenticate.jsx';

const home = () => (
    <section>
      <div className="row homescreen">
        <h1 className="center-align">DocManager</h1>
        <p className="center-align">
          We let you create, secure and access documents
          from anywhere in the world.
        </p>
        <Authenticate />
      </div>
    </section>
  );
export default home;
