import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Alert from 'sweetalert2';

/**
 *
 * @param {object} event - contains information
 * about the element raising the event
 * @param {*} documentCreation - a function that handles
 * the event to create documents
 * @param {*} userId - the user Id creating the document
 * @return {null} returns null
 */
const createDocument = (event, documentCreation, userId) => {
  event.preventDefault();
  const title = $('#docform input[name=title]').val();
  const body = $('#docform textarea[name=body]').val();
  const access = $('#docform input[name=group1]:checked').val();
  const token = localStorage.getItem('docmanagertoken');
  const formValue = { title, body, access, userId, token };
  documentCreation(formValue).then((res) => {
    if (res.status === 'successful') {
      Alert({
        title: res.status,
        text: 'Your document has been created',
        type: 'success',
        confirmButtonText: 'ok'
      });
      document.getElementById('form').reset();
    } else {
      Alert({
        title: res.status,
        text: res.message,
        type: 'error',
        confirmButtonText: 'ok'
      });
    }
  });
};

/**
 * Component that renders the form to create a document
 * @param {object} an object containing properties for creating a document
 * @return {object} returns the html to render
 */
const CreateDocument = ({ documentCreation, userId, roleType }) => (
  <form id="form" action="">
    <div id="docform">
      <input type="text" placeholder="title" name="title" />
      <textarea name="body" id="" cols="100" rows="10" placeholder="content" />
      Access level:
    <p>
      <input
        className="with-gap"
        name="group1"
        type="radio"
        id="public"
        value="Public"
      />
      <label htmlFor="public">Public</label>
    </p>
      <p>
        <input
          className="with-gap"
          name="group1"
          value={roleType}
          type="radio"
          id="role"
        />
        <label htmlFor="role">{roleType}</label>
      </p>
      <p>
        <input
          className="with-gap"
          name="group1"
          type="radio"
          value="Private"
          id="private"
        />
        <label htmlFor="private">Private</label>
      </p>
      <button
        className="btn waves-effect waves-light"
        type="submit"
        name="action"
        onClick={(event) => {
          createDocument(event, documentCreation, userId);
        }}
      >create
    </button>
    </div>
  </form>
);

CreateDocument.propTypes = {
  documentCreation: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  roleType: PropTypes.string.isRequired,
};

export default CreateDocument;
