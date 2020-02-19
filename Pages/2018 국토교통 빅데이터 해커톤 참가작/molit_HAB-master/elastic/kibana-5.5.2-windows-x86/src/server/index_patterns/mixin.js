'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexPatternsMixin = indexPatternsMixin;

var _service = require('./service');

var _routes = require('./routes');

function indexPatternsMixin(kbnServer, server) {
  const pre = {
    /**
    *  Create an instance of the `indexPatterns` service
    *  @type {Hapi.Pre}
    */
    getIndexPatternsService: {
      assign: 'indexPatterns',
      method(req, reply) {
        const dataCluster = req.server.plugins.elasticsearch.getCluster('data');
        const callDataCluster = (...args) => dataCluster.callWithRequest(req, ...args);

        reply(new _service.IndexPatternsService(callDataCluster));
      }
    }
  };

  server.route((0, _routes.createTestTimePatternRoute)(pre));
  server.route((0, _routes.createFieldsForWildcardRoute)(pre));
  server.route((0, _routes.createFieldsForTimePatternRoute)(pre));
}
