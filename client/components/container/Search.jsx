import React from 'react';

const Search = () => (
  <div className="row">
    <div className="col s8">
      <input type="text" placeholder="search my documents" />
    </div>
    <div className="col s2">
      <i
        className="fa fa-search-plus small"
        aria-hidden="true"
      />
    </div>
  </div>
);
export default Search;
