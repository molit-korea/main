'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportDashboards = undefined;

let exportDashboards = exports.exportDashboards = (() => {
  var _ref = _asyncToGenerator(function* (req) {
    const ids = _lodash2.default.flatten([req.query.dashboard]);
    const config = req.server.config();

    var _req$server$plugins$e = req.server.plugins.elasticsearch.getCluster('admin');

    const callWithRequest = _req$server$plugins$e.callWithRequest;

    const callAdminCluster = function callAdminCluster(...args) {
      return callWithRequest(req, ...args);
    };
    const savedObjectsClient = new _saved_objects.SavedObjectsClient(config.get('kibana.index'), callAdminCluster);

    const objects = yield (0, _collect_dashboards.collectDashboards)(savedObjectsClient, ids);
    return {
      version: config.get('pkg.version'),
      objects
    };
  });

  return function exportDashboards(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _collect_dashboards = require('./collect_dashboards');

var _saved_objects = require('../../../../../server/saved_objects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
