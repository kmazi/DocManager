import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

const editDetail = (userId, editUser) => {
  const userDetail = {};
  if ($('#userEmail').val() !== '') {
    userDetail.email = $('#userEmail').val();
  }
  if ($('#newpassword').val() !== '') {
    userDetail.password = $('#newpassword').val();
  }
  editUser(userDetail, userId, localStorage.getItem('docmanagertoken'));
};

const UserView = ({ userName, userId, userEmail, updateStatus,
  changeInputValue, createdAt, roleType, editUserDetail }) => (
    <div id="userview" className="container">
      <h5 className="center-align">SignUp Details</h5>
      <hr />
      <div className="row">
        <div className="col m2">
          <label htmlFor="username">UserName:</label>
        </div>
        <div className="col m10">
          <input id="username" type="text" value={userName} disabled />
        </div>

      </div>
      <div className="row">
        <div className="col m2">
          <label htmlFor="userEmail">userEmail:</label>
        </div>
        <div className="col m10">
          <input
            id="userEmail"
            type="text"
            onChange={() => {
              changeInputValue($('#userEmail').val());
            }}
            value={userEmail}
            disabled
          />
        </div>

      </div>
      <div className="row">
        <div className="col m2">
          <label htmlFor="roleType">Role:</label>
        </div>
        <div className="col m10">
          <p id="roleType">{roleType}</p>
        </div>
      </div>
      <div id="passwordreset" className="hide">
        <div className="row">
          <div className="col m2">
            <label htmlFor="oldpassword">Old password</label>
          </div>
          <div className="col m10">
            <input id="oldpassword" type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col m2">
            <label htmlFor="newpassword">New password</label>
          </div>
          <div className="col m10">
            <input id="newpassword" type="text" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col m2">
          <label htmlFor="signUpDate">signUpDate:</label>
        </div>
        <div className="col m10">
          <p id="signUpDate">{createdAt}</p>
        </div>
      </div>
      <div className="row">
        <button
          onClick={(event) => {
            event.preventDefault();
            $('#userEmail').prop('disabled', (i, v) => (!v));
            $('#passwordreset, #submitedit').toggleClass('hide');
          }}
        >Edit profile</button>
        <button
          id="submitedit"
          className="hide"
          onClick={(event) => {
            event.preventDefault();
            editDetail(userId, editUserDetail);
            $('#userEmail').prop('disabled', (i, v) => (!v));
            $('#passwordreset, #submitedit').toggleClass('hide');
          }}
        >{updateStatus}</button>
      </div>
    </div>
);

UserView.propTypes = {
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  roleType: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  updateStatus: PropTypes.string.isRequired,
  changeInputValue: PropTypes.func.isRequired,
  editUserDetail: PropTypes.func.isRequired,
};

export default UserView;
