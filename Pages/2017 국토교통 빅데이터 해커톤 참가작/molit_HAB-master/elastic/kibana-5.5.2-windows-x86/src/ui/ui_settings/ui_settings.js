'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSettings = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _defaults = require('./defaults');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function hydrateUserSettings(user) {
  return Object.keys(user).map(key => ({ key, userValue: user[key] })).filter(({ userValue }) => userValue !== null).reduce((acc, { key, userValue }) => _extends({}, acc, { [key]: { userValue } }), {});
}

function assertRequest(req) {
  if (!req || typeof req !== 'object' || typeof req.path !== 'string' || !req.headers || typeof req.headers !== 'object') {
    throw new TypeError('all uiSettings methods must be passed a hapi.Request object');
  }
}

class UiSettings {
  constructor(server, status) {
    this._server = server;
    this._status = status;
  }

  getDefaults() {
    return (0, _defaults.getDefaultSettings)();
  }

  // returns a Promise for the value of the requested setting
  get(req, key) {
    var _this = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);
      return _this.getAll(req).then(function (all) {
        return all[key];
      });
    })();
  }

  getAll(req) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);
      return _this2.getRaw(req).then(function (raw) {
        return Object.keys(raw).reduce(function (all, key) {
          const item = raw[key];
          const hasUserValue = 'userValue' in item;
          all[key] = hasUserValue ? item.userValue : item.value;
          return all;
        }, {});
      });
    })();
  }

  getRaw(req) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);
      return _this3.getUserProvided(req).then(function (user) {
        return (0, _lodash.defaultsDeep)(user, _this3.getDefaults());
      });
    })();
  }

  getUserProvided(req, { ignore401Errors = false } = {}) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);

      var _server$plugins$elast = _this4._server.plugins.elasticsearch.getCluster('admin');

      const callWithRequest = _server$plugins$elast.callWithRequest,
            errors = _server$plugins$elast.errors;

      // If the ui settings status isn't green, we shouldn't be attempting to get
      // user settings, since we can't be sure that all the necessary conditions
      // (e.g. elasticsearch being available) are met.

      if (_this4._status.state !== 'green') {
        return hydrateUserSettings({});
      }

      const params = _this4._getClientSettings();
      const allowedErrors = [errors[404], errors[403], errors.NoConnections];
      if (ignore401Errors) allowedErrors.push(errors[401]);

      return _bluebird2.default.resolve(callWithRequest(req, 'get', params, { wrap401Errors: !ignore401Errors })).catch(...allowedErrors, function () {
        return {};
      }).then(function (resp) {
        return resp._source || {};
      }).then(function (source) {
        return hydrateUserSettings(source);
      });
    })();
  }

  setMany(req, changes) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);

      var _server$plugins$elast2 = _this5._server.plugins.elasticsearch.getCluster('admin');

      const callWithRequest = _server$plugins$elast2.callWithRequest;

      const clientParams = _extends({}, _this5._getClientSettings(), {
        body: { doc: changes }
      });
      return callWithRequest(req, 'update', clientParams).then(function () {
        return {};
      });
    })();
  }

  set(req, key, value) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);
      return _this6.setMany(req, { [key]: value });
    })();
  }

  remove(req, key) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);
      return _this7.set(req, key, null);
    })();
  }

  removeMany(req, keys) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      assertRequest(req);
      const changes = {};
      keys.forEach(function (key) {
        changes[key] = null;
      });
      return _this8.setMany(req, changes);
    })();
  }

  _getClientSettings() {
    const config = this._server.config();
    const index = config.get('kibana.index');
    const id = config.get('pkg.version');
    const type = 'config';
    return { index, type, id };
  }
}
exports.UiSettings = UiSettings;
