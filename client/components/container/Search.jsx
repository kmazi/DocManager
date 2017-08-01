import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { searchDocuments } from '../../actions/documentActions';
import Search from '../presentation/Search';

const mapStateToProps = () => ({

});
export default
connect(mapStateToProps, { searchDocuments })(withRouter(Search));
