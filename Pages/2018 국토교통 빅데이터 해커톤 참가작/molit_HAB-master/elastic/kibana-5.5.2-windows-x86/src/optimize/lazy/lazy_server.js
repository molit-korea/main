'use strict';

var _hapi = require('hapi');

var _bluebird = require('bluebird');

var _register_hapi_plugins = require('../../server/http/register_hapi_plugins');

var _register_hapi_plugins2 = _interopRequireDefault(_register_hapi_plugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = class LazyServer {
  constructor(host, port, optimizer) {
    this.optimizer = optimizer;
    this.server = new _hapi.Server();

    (0, _register_hapi_plugins2.default)(null, this.server);

    this.server.connection({
      host: host,
      port: port
    });
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.optimizer.init();
      _this.optimizer.bindToServer(_this.server);
      yield (0, _bluebird.fromNode)(function (cb) {
        return _this.server.start(cb);
      });
    })();
  }
};
