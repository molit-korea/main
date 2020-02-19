'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importDashboards = undefined;

let importDashboards = exports.importDashboards = (() => {
  var _ref = _asyncToGenerator(function* (req) {
    const payload = req.payload;

    const config = req.server.config();
    const force = 'force' in req.query && req.query.force !== false;
    const exclude = (0, _lodash.flatten)([req.query.exclude]);

    var _req$server$plugins$e = req.server.plugins.elasticsearch.getCluster('admin');

    const callWithRequest = _req$server$plugins$e.callWithRequest;

    const callAdminCluster = function callAdminCluster(...args) {
      return callWithRequest(req, ...args);
    };
    const savedObjectsClient = new _saved_objects.SavedObjectsClient(config.get('kibana.index'), callAdminCluster);

    if (payload.version !== config.get('pkg.version')) {
      throw new Error(`Version ${payload.version} does not match ${config.get('pkg.version')}.`);
    }

    const docs = payload.objects.filter(function (item) {
      return !exclude.includes(item.type);
    });

    const objects = yield savedObjectsClient.bulkCreate(docs, { force });
    return { objects };
  });

  return function importDashboards(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _lodash = require('lodash');

var _saved_objects = require('../../../../../server/saved_objects');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
