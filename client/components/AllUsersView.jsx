import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AllUsersView = ({ allUsers, responseStatus, error }) => {
  const users = allUsers.map(user => (
    <tr id={user.id} key={user.id}>
      <td>
        <span>{user.id}</span>
      </td>
      <td>
        <span>{user.username}</span>
      </td>
      <td>
        <span>{user.email}</span>
      </td>
      <td>
        <span>{user.roleId}</span>
      </td>
      <td>
        <span>{user.createdAt}</span>
      </td>
      <td>
        <button
          onClick={(event) => {
            event.preventDefault();
          }}
        >Deactivate</button>
      </td>
      <td>
        <button
          onClick={(event) => {
            event.preventDefault();
          }}
        >Activate</button>
      </td>
      <td>
        <button
          onClick={(event) => {
            event.preventDefault();
          }}
        >Change Role</button>
      </td>
    </tr>
  ));
  const userDetailsTable = (<table className="table">
    <thead>
      <tr>
        <th>
          <span>Id</span>
        </th>
        <th>
          <span>UserName</span>
        </th>
        <th>
          <span>UserEmail</span>
        </th>
        <th>
          <span>RoleId</span>
        </th>
        <th>
          <span>CreatedAt</span>
        </th>
      </tr>
    </thead>
    <tbody>
      {users}
    </tbody>
  </table>);
  const errorMessage = <p>{error}</p>;
  return (<section>
    {responseStatus === 'successful' ? userDetailsTable : errorMessage}
  </section>
  );
};

AllUsersView.propTypes = {
  allUsers: PropTypes.arrayOf(PropTypes.shape({
    userName: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    roleType: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  error: PropTypes.string.isRequired,
  responseStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  allUsers: state.fetchAllUsers.users,
  responseStatus: state.fetchAllUsers.responseStatus,
  error: state.fetchAllUsers.status,
});

export default connect(mapStateToProps)(AllUsersView);
