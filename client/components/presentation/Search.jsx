import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

const Search = ({ searchDocuments, searchAccess }) => (
  <div className="searchcontainer">
    <div className="">
      <input type="text" placeholder="search my documents" />
      <button
        className="right"
        onClick={(event) => {
          event.preventDefault();
          const searchText = $('.searchcontainer input').val();
          searchDocuments(searchText, searchAccess,
          localStorage.getItem('docmanagertoken'));
        }}
      >
        <i
          className="fa fa-search-plus small"
          aria-hidden="true"
        /></button>
    </div>
  </div>
);

Search.propTypes = {
  searchDocuments: PropTypes.func.isRequired,
  searchAccess: PropTypes.string.isRequired,
};

export default Search;
