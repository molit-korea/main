'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAdminCluster = createAdminCluster;

var _lodash = require('lodash');

var _client_logger = require('./client_logger');

function createAdminCluster(server) {
  const config = server.config();
  const ElasticsearchClientLogging = (0, _client_logger.clientLogger)(server);

  class AdminClientLogging extends ElasticsearchClientLogging {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.tags = ['admin'], this.logQueries = config.get('elasticsearch.logQueries'), _temp;
    }

  }

  const adminCluster = server.plugins.elasticsearch.createCluster('admin', Object.assign({ log: AdminClientLogging }, config.get('elasticsearch')));

  server.on('close', (0, _lodash.bindKey)(adminCluster, 'close'));
}
