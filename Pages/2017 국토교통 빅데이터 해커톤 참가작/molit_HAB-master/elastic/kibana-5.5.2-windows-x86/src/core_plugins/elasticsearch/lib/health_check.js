'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _migrate_config = require('./migrate_config');

var _migrate_config2 = _interopRequireDefault(_migrate_config);

var _create_kibana_index = require('./create_kibana_index');

var _create_kibana_index2 = _interopRequireDefault(_create_kibana_index);

var _kibana_version = require('./kibana_version');

var _kibana_version2 = _interopRequireDefault(_kibana_version);

var _ensure_es_version = require('./ensure_es_version');

var _ensure_not_tribe = require('./ensure_not_tribe');

var _ensure_allow_explicit_index = require('./ensure_allow_explicit_index');

var _determine_enabled_scripting_langs = require('./determine_enabled_scripting_langs');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const NoConnections = _elasticsearch2.default.errors.NoConnections;

const format = _util2.default.format;

const NO_INDEX = 'no_index';
const INITIALIZING = 'initializing';
const READY = 'ready';

module.exports = function (plugin, server, { mappings }) {
  const config = server.config();
  const callAdminAsKibanaUser = server.plugins.elasticsearch.getCluster('admin').callWithInternalUser;
  const callDataAsKibanaUser = server.plugins.elasticsearch.getCluster('data').callWithInternalUser;
  const REQUEST_DELAY = config.get('elasticsearch.healthCheck.delay');

  plugin.status.yellow('Waiting for Elasticsearch');
  function waitForPong(callWithInternalUser, url) {
    return callWithInternalUser('ping').catch(function (err) {
      if (!(err instanceof NoConnections)) throw err;
      plugin.status.red(format('Unable to connect to Elasticsearch at %s.', url));

      return _bluebird2.default.delay(REQUEST_DELAY).then(waitForPong.bind(null, callWithInternalUser, url));
    });
  }

  // just figure out the current "health" of the es setup
  function getHealth() {
    return callAdminAsKibanaUser('cluster.health', {
      timeout: '5s', // tells es to not sit around and wait forever
      index: config.get('kibana.index'),
      ignore: [408]
    }).then(function (resp) {
      // if "timed_out" === true then elasticsearch could not
      // find any idices matching our filter within 5 seconds
      if (!resp || resp.timed_out) {
        return NO_INDEX;
      }

      // If status === "red" that means that index(es) were found
      // but the shards are not ready for queries
      if (resp.status === 'red') {
        return INITIALIZING;
      }

      return READY;
    });
  }

  function waitUntilReady() {
    return getHealth().then(function (health) {
      if (health !== READY) {
        return _bluebird2.default.delay(REQUEST_DELAY).then(waitUntilReady);
      }
    });
  }

  function waitForShards() {
    return getHealth().then(function (health) {
      if (health === NO_INDEX) {
        plugin.status.yellow('No existing Kibana index found');
        return (0, _create_kibana_index2.default)(server, mappings);
      }

      if (health === INITIALIZING) {
        plugin.status.red('Elasticsearch is still initializing the kibana index.');
        return _bluebird2.default.delay(REQUEST_DELAY).then(waitForShards);
      }
    });
  }

  function waitForEsVersion() {
    return (0, _ensure_es_version.ensureEsVersion)(server, _kibana_version2.default.get()).catch(err => {
      plugin.status.red(err);
      return _bluebird2.default.delay(REQUEST_DELAY).then(waitForEsVersion);
    });
  }

  function setGreenStatus() {
    return plugin.status.green('Kibana index ready');
  }

  function check() {
    const results = {};

    const healthCheck = waitForPong(callAdminAsKibanaUser, config.get('elasticsearch.url')).then(waitForEsVersion).then(() => (0, _ensure_not_tribe.ensureNotTribe)(callAdminAsKibanaUser)).then(() => (0, _ensure_allow_explicit_index.ensureAllowExplicitIndex)(callAdminAsKibanaUser, config)).then(waitForShards).then(_lodash2.default.partial(_migrate_config2.default, server, { mappings })).then(_asyncToGenerator(function* () {
      results.enabledScriptingLangs = yield (0, _determine_enabled_scripting_langs.determineEnabledScriptingLangs)(callDataAsKibanaUser);
    })).then(() => {
      const tribeUrl = config.get('elasticsearch.tribe.url');
      if (tribeUrl) {
        return waitForPong(callDataAsKibanaUser, tribeUrl).then(() => (0, _ensure_es_version.ensureEsVersion)(server, _kibana_version2.default.get(), callDataAsKibanaUser));
      }
    });

    return healthCheck.then(() => server.expose('latestHealthCheckResults', results)).then(setGreenStatus).catch(err => plugin.status.red(err));
  }

  let timeoutId = null;

  function scheduleCheck(ms) {
    if (timeoutId) return;

    const myId = setTimeout(function () {
      check().finally(function () {
        if (timeoutId === myId) startorRestartChecking();
      });
    }, ms);

    timeoutId = myId;
  }

  function startorRestartChecking() {
    scheduleCheck(stopChecking() ? REQUEST_DELAY : 1);
  }

  function stopChecking() {
    if (!timeoutId) return false;
    clearTimeout(timeoutId);
    timeoutId = null;
    return true;
  }

  server.ext('onPreStop', (request, reply) => {
    stopChecking();
    reply();
  });

  return {
    waitUntilReady: waitUntilReady,
    run: check,
    start: startorRestartChecking,
    stop: stopChecking,
    isRunning: function isRunning() {
      return !!timeoutId;
    }
  };
};
