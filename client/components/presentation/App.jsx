import React from 'react';
import '../../styles/materialize-src/sass/materialize.scss';
import '../../styles/home.scss';
import Routes from '../../Routes';

const App = () => {
  const minHeight = {
    minHeight: window.innerHeight || document.documentElement.clientHeight
  };
  const maxWidth = {
    minHeight: window.innerHeight || document.documentElement.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth
  };
  return (
    <section style={minHeight} className="bkgImage">
      <div id="mainoverlay" style={maxWidth}>
        {Routes}
      </div>
    </section>
  );
};

export default App;
