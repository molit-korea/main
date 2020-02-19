'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsMixin = savedObjectsMixin;

var _client = require('./client');

var _routes = require('./routes');

function savedObjectsMixin(kbnServer, server) {
  const prereqs = {
    getSavedObjectsClient: {
      assign: 'savedObjectsClient',
      method(req, reply) {
        const adminCluster = req.server.plugins.elasticsearch.getCluster('admin');
        const callAdminCluster = (...args) => adminCluster.callWithRequest(req, ...args);

        reply(new _client.SavedObjectsClient(server.config().get('kibana.index'), callAdminCluster));
      }
    }
  };

  server.route((0, _routes.createCreateRoute)(prereqs));
  server.route((0, _routes.createDeleteRoute)(prereqs));
  server.route((0, _routes.createFindRoute)(prereqs));
  server.route((0, _routes.createReadRoute)(prereqs));
  server.route((0, _routes.createUpdateRoute)(prereqs));
}
