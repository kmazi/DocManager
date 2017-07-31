import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { editUserDetail, changeInputValue } from '../../actions/userActions';
import UserView from '../presentation/UserView';

const mapStateToProps = state => ({
  userName: state.authenticateUser.userName,
  updateStatus: state.authenticateUser.updateStatus,
  disabled: state.authenticateUser.disabled,
  userEmail: state.authenticateUser.updateEmail,
  userId: state.authenticateUser.userId,
  roleType: state.authenticateUser.roleType,
  createdAt: state.authenticateUser.createdAt,
});

export default
connect(mapStateToProps, { editUserDetail,
  changeInputValue })(withRouter(UserView));
