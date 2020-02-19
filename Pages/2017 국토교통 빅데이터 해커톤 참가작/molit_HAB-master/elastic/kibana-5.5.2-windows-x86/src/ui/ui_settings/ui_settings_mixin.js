'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettingsMixin = uiSettingsMixin;

var _ui_settings = require('./ui_settings');

var _mirror_status = require('./mirror_status');

function uiSettingsMixin(kbnServer, server, config) {
  const status = kbnServer.status.create('ui settings');

  if (!config.get('uiSettings.enabled')) {
    status.disabled('uiSettings.enabled config is set to `false`');
    return;
  }

  const uiSettings = new _ui_settings.UiSettings(server, status);
  server.decorate('server', 'uiSettings', () => uiSettings);
  kbnServer.ready().then(() => {
    (0, _mirror_status.mirrorStatus)(status, kbnServer.status.getForPluginId('elasticsearch'));
  });
}
