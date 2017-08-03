import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { readDocument, deleteDocument,
  paginateDocument } from '../../actions/documentActions';
import DocumentView from '../presentation/DocumentView';

const mapStateToProps = state => ({
  id: state.authenticateUser.userId,
  documents: state.fetchDocuments.documents,
  read: state.readDocument.status,
  deleteId: state.readDocument.delStatus,
  shouldDisplay: state.fetchDocuments.isReady,
  documentStatus: state.fetchDocuments.status,
  documentAccess: state.fetchDocuments.documentaccess,
  currentPage: state.fetchDocuments.currentPage,
  documentsCount: state.fetchDocuments.documentCounter,
});
export default connect(mapStateToProps,
  { readDocument, deleteDocument, paginateDocument })(withRouter(DocumentView));
