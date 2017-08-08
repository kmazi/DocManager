import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'sweetalert2';
import Pagination from 'react-js-pagination';

const processRole = (roleId) => {
  switch (roleId) {
  case 1:
    return 'Admin';
  case 2:
    return 'Fellow';
  case 3:
    return 'Learning';
  case 4:
    return 'Devops';
  default:
    break;
  }
};

const formatDate = (datetime) => {
  if (datetime) {
    const date = datetime.substring(0, datetime.indexOf('T'));
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }
};

const AllUsersView = ({ allUsers, responseStatus, error,
  deactivateUser, deactivatedUserId, counter, currentPage,
  fetchAllUsers }) => {
  const users = allUsers.map(user => (
    <tr id={user.id} key={user.id}>
      <td>
        <span>{user.username}</span>
      </td>
      <td>
        <span>{user.email}</span>
      </td>
      <td>
        <span>{processRole(user.roleId)}</span>
      </td>
      <td>
        <span>{formatDate(user.createdAt)}</span>
      </td>
      <td>
        <button
          onClick={(event) => {
            event.preventDefault();
            Alert({
              title: `Comfirm ${user.isactive && deactivatedUserId !== user.id
        ? 'Deactivation' : 'Activation'}`,
              text: `Are you sure you want to
              ${user.isactive && deactivatedUserId !== user.id
        ? 'Deactivate' : 'Activate'} ${user.username}`,
              type: 'info',
              showCloseButton: true,
              showCancelButton: true,
              confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Yes!',
              cancelButtonText:
                '<i class="fa fa-thumbs-down"></i> No',
              showLoaderOnConfirm: true,
              preConfirm: () => new Promise((resolve, reject) => {
                deactivateUser(user.id)
                .then((res) => {
                  if (res.status === 'successful') {
                    resolve();
                  } else {
                    reject();
                  }
                });
              }),
              allowOutsideClick: false
            }).then(() => {
              Alert({
                type: 'success',
                title: 'Operation successful!',
              });
            });
          }}
        >{user.isactive && deactivatedUserId !== user.id
        ? 'Deactivate' : 'Activate'}</button>
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

  const userDetailsTable = (
    <div id="viewusers">
      <table className="table">
        <thead>
          <tr>
            <th>
              <span>UserName</span>
            </th>
            <th>
              <span>UserEmail</span>
            </th>
            <th>
              <span>Department/Role</span>
            </th>
            <th>
              <span>Registered on</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users}
        </tbody>
      </table>
      <div className={counter > 8 ? 'row' : 'row hide'}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={8}
          totalItemsCount={counter}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => {
            const offSet = (pageNumber - 1) * 8;
            fetchAllUsers(offSet, pageNumber);
          }}
        />
      </div>
    </div>
    );
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
  counter: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired,
  fetchAllUsers: PropTypes.func.isRequired,
  deactivatedUserId: PropTypes.number.isRequired,
  responseStatus: PropTypes.string.isRequired,
  deactivateUser: PropTypes.func.isRequired,
};

export default AllUsersView;
