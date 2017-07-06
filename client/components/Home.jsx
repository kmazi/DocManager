import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.scss';
import '../styles/materialize-src/sass/materialize.scss';

const home = () =>
  (
    <section>
      <div className="row homescreen">
        <h1 className="center-align">DocManager</h1>
        <p className="center-align">
          We let you create, secure and access documents
          from anywhere in the world.
        </p>
        <Link
          className="center-align waves-effect waves-light btn"
          to="/signin"
        >Get Started</Link>
      </div>
    </section>
  );
export default home;
