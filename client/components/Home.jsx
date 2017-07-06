import React from 'react';
import { Link } from 'react-router-dom';

const home = () =>
  (
    <section>
      <div className="row">
        <h1 className="center-align">DocManager</h1>
        <p className="center-align">
          We let you create, secure and access documents
          from anywhere in the world.
        </p>
        <Link to="/signin">Get Started</Link>
      </div>
    </section>
  );
export default home;
