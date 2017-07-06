import React from 'react';
import { Link } from 'react-router-dom';
import { bkgImage } from '../styles/home.scss';
import Routes from '../routes';

const App = () => {
  const minHeight = {
    minHeight: window.innerHeight || document.documentElement.clientHeight
  };
  const maxWidth = {
    minHeight: window.innerHeight || document.documentElement.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth
  };
  return (
    <section style={minHeight} className={bkgImage}>
      <div className="row">
        <h1 className="center-align">DocManager</h1>
        <p className="center-align">
          We let you create, secure and access documents
          from anywhere in the world.
        </p>
        <Link to="/signin">Get Started</Link>
      </div>
      <div id="mainoverlay" style={maxWidth}>
        {Routes}
      </div>
    </section>
  );
};

export default App;
