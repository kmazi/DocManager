import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Authenticate from '../presentation/Authenticate';
import { signInUser, signUserUp } from '../../actions/userActions';
import { getUserDocuments } from '../../actions/documentActions';

// Maps the application state to component properties
const mapStateToProps = state => ({
  signInButtonText: state.authenticateUser.signInStatus,
  signUpButtonText: state.authenticateUser.signUpStatus,
});

export default connect(mapStateToProps,
  { signUserUp, signInUser, getUserDocuments })(withRouter(Authenticate));
