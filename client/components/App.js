import React from 'react';
import { Link } from 'react-router-dom';
import { footer,
        signform, 
        bkgImage } from '../styles/home.scss';
import $ from 'jquery';
import Routes from '../routes';

const App = () => {
const height = { 
  height: window.innerHeight || document.documentElement.clientHeight };
return(
  <section style= {height} className={bkgImage}>
    <div className={signform}>
    </div>
    {/*{Routes}*/}
    {/*<footer className={footer}>
      <Link to="/">Filterable Table</Link>
      <Link to="/about">About</Link>
    </footer> */}
  </section>
  );
}

export default App;
