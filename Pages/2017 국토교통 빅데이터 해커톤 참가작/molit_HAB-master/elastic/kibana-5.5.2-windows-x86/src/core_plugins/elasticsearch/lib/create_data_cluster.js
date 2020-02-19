'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDataCluster = createDataCluster;

var _lodash = require('lodash');

var _client_logger = require('./client_logger');

function createDataCluster(server) {
  const config = server.config();
  const ElasticsearchClientLogging = (0, _client_logger.clientLogger)(server);

  class DataClientLogging extends ElasticsearchClientLogging {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.tags = ['data'], this.logQueries = getConfig().logQueries, _temp;
    }

  }

  function getConfig() {
    if (Boolean(config.get('elasticsearch.tribe.url'))) {
      return config.get('elasticsearch.tribe');
    }

    return config.get('elasticsearch');
  }

  const dataCluster = server.plugins.elasticsearch.createCluster('data', Object.assign({ log: DataClientLogging }, getConfig()));

  server.on('close', (0, _lodash.bindKey)(dataCluster, 'close'));
}
