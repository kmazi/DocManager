'use strict';

var _role = require('./role');

var Roles = _interopRequireWildcard(_role);

var _document = require('./document');

var Documents = _interopRequireWildcard(_document);

var _user = require('./user');

var Users = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  Roles: Roles,
  Documents: Documents,
  Users: Users
};