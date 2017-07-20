import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import alert from 'sweetalert2';
import { connect } from 'react-redux';

import { documentCreation } from '../actions/documentActions';

const CreateDocument = ({ createUserDocument, userId }) => (
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
      <input className="with-gap" name="group1" value="Role" type="radio" id="role" />
      <label htmlFor="role">Role</label>
    </p>
    <p>
      <input className="with-gap" name="group1" type="radio" value="Private" id="private" />
      <label htmlFor="private">Private</label>
    </p>
    <button
      className="btn waves-effect waves-light"
      type="submit"
      name="action"
      onClick={(event) => {
        const title = $('#docform input[name=title]').val();
        const body = $('#docform textarea[name=body]').val();
        const access = $('#docform input[name=group1]:checked').val();
        const token = localStorage.getItem('docmanagertoken');
        const formValue = { title, body, access, userId, token };
        event.preventDefault();
        createUserDocument(formValue);
      }}
    >create
    </button>
  </div>
);

CreateDocument.propTypes = {
  createUserDocument: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  userId: state.authenticateUser.userId,
});

const mapDispatchToProps = dispatch => ({
  createUserDocument: (formValue) => {
    dispatch(documentCreation(formValue));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDocument);
