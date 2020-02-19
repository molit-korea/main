'use strict';

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class PluginApi {
  constructor(kibana, pluginPath) {
    this.config = kibana.config;
    this.rootDir = kibana.rootDir;
    this.package = require((0, _path.join)(pluginPath, 'package.json'));
    this.Plugin = _plugin2.default.scoped(kibana, pluginPath, this.package);
  }

  get uiExports() {
    throw new Error('plugin.uiExports is not defined until initialize phase');
  }

  get autoload() {
    console.warn(`${this.package.id} accessed the autoload lists which are no longer available via the Plugin API.` + 'Use the `ui/autoload/*` modules instead.');

    return {
      directives: [],
      filters: [],
      styles: [],
      modules: [],
      require: []
    };
  }
};
