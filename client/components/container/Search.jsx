import React from 'react';
import $ from 'jquery';

const Search = () => (
  <div className="searchcontainer">
    <div className="">
      <input type="text" placeholder="search my documents" />
      <button
        className="right"
        onClick={(event) => {
          event.preventDefault();
          const searchText = $('.searchcontainer input').val();
          search(searchText, localStorage.getItem('docmanagertoken'));
        }}
      >
        <i
          className="fa fa-search-plus small"
          aria-hidden="true"
        /></button>
    </div>
  </div>
);
export default Search;
