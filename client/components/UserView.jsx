import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const UserView = ({ userName, userEmail, createdAt, roleType }) => (
  <div>
    <h5>SignUp Details</h5>
    <div>
      <label htmlFor="username">UserName:</label>
      <input id="username" type="text" value={userName} disabled />
    </div>
    <div>
      <label htmlFor="userEmail">userEmail:</label>
      <input id="userEmail" type="text" value={userEmail} disabled />
    </div>
    <div>
      <label htmlFor="roleType">Role:</label>
      <p id="roleType">{roleType}</p>
    </div>
    <div>
      <label htmlFor="signUpDate">signUpDate:</label>
      <p id="signUpDate">{createdAt}</p>
    </div>
  </div>
);

UserView.propTypes = {
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  roleType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  userName: state.authenticateUser.userName,
  userEmail: state.authenticateUser.userEmail,
  roleType: state.authenticateUser.roleType,
  createdAt: state.authenticateUser.createdAt,
});

export default connect(mapStateToProps)(UserView);
