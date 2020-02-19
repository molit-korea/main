'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _package = require('../../../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class ServerStatus {
  constructor(server) {
    this.server = server;
    this._created = {};
  }

  create(id) {
    const status = new _status2.default(id, this.server);
    this._created[status.id] = status;
    return status;
  }

  createForPlugin(plugin) {
    if (plugin.version === 'kibana') plugin.version = _package.version;
    const status = this.create(`plugin:${plugin.id}@${plugin.version}`);
    status.plugin = plugin;
    return status;
  }

  each(fn) {
    const self = this;
    _lodash2.default.forOwn(self._created, function (status, i, list) {
      if (status.state !== 'disabled') {
        fn.call(self, status, i, list);
      }
    });
  }

  get(id) {
    return this._created[id];
  }

  getForPluginId(pluginId) {
    return _lodash2.default.find(this._created, s => s.plugin && s.plugin.id === pluginId);
  }

  getState(id) {
    const status = this.get(id);
    if (!status) return undefined;
    return status.state || 'uninitialized';
  }

  getStateForPluginId(pluginId) {
    const status = this.getForPluginId(pluginId);
    if (!status) return undefined;
    return status.state || 'uninitialized';
  }

  overall() {
    const state = (0, _lodash2.default)(this._created).map(function (status) {
      return _states2.default.get(status.state);
    }).sortBy('severity').pop();

    const statuses = _lodash2.default.where(this._created, { state: state.id });
    const since = _lodash2.default.get(_lodash2.default.sortBy(statuses, 'since'), [0, 'since']);

    return {
      state: state.id,
      title: state.title,
      nickname: _lodash2.default.sample(state.nicknames),
      icon: state.icon,
      since: since
    };
  }

  isGreen() {
    return this.overall().state === 'green';
  }

  notGreen() {
    return !this.isGreen();
  }

  toString() {
    const overall = this.overall();
    return `${overall.title} – ${overall.nickname}`;
  }

  toJSON() {
    return {
      overall: this.overall(),
      statuses: _lodash2.default.values(this._created)
    };
  }
};
