'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLanguages = registerLanguages;
function registerLanguages(server) {
  server.route({
    path: '/api/kibana/scripts/languages',
    method: 'GET',
    handler: function handler(request, reply) {
      var _server$plugins$elast = server.plugins.elasticsearch.latestHealthCheckResults;
      const latestHealthCheckResults = _server$plugins$elast === undefined ? {} : _server$plugins$elast;

      reply(latestHealthCheckResults.enabledScriptingLangs || []);
    }
  });
}
