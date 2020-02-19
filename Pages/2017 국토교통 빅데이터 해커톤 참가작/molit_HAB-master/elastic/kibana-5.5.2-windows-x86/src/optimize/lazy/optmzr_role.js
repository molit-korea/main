'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lazy_server = require('./lazy_server');

var _lazy_server2 = _interopRequireDefault(_lazy_server);

var _lazy_optimizer = require('./lazy_optimizer');

var _lazy_optimizer2 = _interopRequireDefault(_lazy_optimizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (kbnServer, kibanaHapiServer, config) {
    const server = new _lazy_server2.default(config.get('optimize.lazyHost'), config.get('optimize.lazyPort'), new _lazy_optimizer2.default({
      log: function log(tags, data) {
        return kibanaHapiServer.log(tags, data);
      },
      env: kbnServer.bundles.env,
      bundles: kbnServer.bundles,
      profile: config.get('optimize.profile'),
      sourceMaps: config.get('optimize.sourceMaps'),
      prebuild: config.get('optimize.lazyPrebuild'),
      urlBasePath: config.get('server.basePath'),
      unsafeCache: config.get('optimize.unsafeCache')
    }));

    let ready = false;

    const sendReady = function sendReady() {
      if (!process.connected) return;
      process.send(['WORKER_BROADCAST', { optimizeReady: ready }]);
    };

    process.on('message', function (msg) {
      if (msg && msg.optimizeReady === '?') sendReady();
    });

    sendReady();

    yield server.init();

    ready = true;
    sendReady();
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = exports['default'];
