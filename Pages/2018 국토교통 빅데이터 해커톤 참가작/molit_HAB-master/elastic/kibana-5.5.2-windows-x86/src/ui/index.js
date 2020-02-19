'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettingsMixin = undefined;

var _ui_settings = require('./ui_settings');

Object.defineProperty(exports, 'uiSettingsMixin', {
  enumerable: true,
  get: function get() {
    return _ui_settings.uiSettingsMixin;
  }
});

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _path = require('path');

var _ui_exports = require('./ui_exports');

var _ui_exports2 = _interopRequireDefault(_ui_exports);

var _ui_bundle = require('./ui_bundle');

var _ui_bundle2 = _interopRequireDefault(_ui_bundle);

var _ui_bundle_collection = require('./ui_bundle_collection');

var _ui_bundle_collection2 = _interopRequireDefault(_ui_bundle_collection);

var _ui_bundler_env = require('./ui_bundler_env');

var _ui_bundler_env2 = _interopRequireDefault(_ui_bundler_env);

var _ui_i18n = require('./ui_i18n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (kbnServer, server, config) {
    let getKibanaPayload = (() => {
      var _ref2 = _asyncToGenerator(function* ({ app, request, includeUserProvidedConfig, injectedVarsOverrides }) {
        const uiSettings = server.uiSettings();
        const translations = yield uiI18n.getTranslationsForRequest(request);

        return {
          app: app,
          nav: uiExports.navLinks.inOrder,
          version: kbnServer.version,
          branch: config.get('pkg.branch'),
          buildNum: config.get('pkg.buildNum'),
          buildSha: config.get('pkg.buildSha'),
          basePath: config.get('server.basePath'),
          serverName: config.get('server.name'),
          devMode: config.get('env.dev'),
          translations: translations,
          uiSettings: yield (0, _bluebird.props)({
            defaults: uiSettings.getDefaults(),
            user: includeUserProvidedConfig && uiSettings.getUserProvided(request)
          }),
          vars: yield (0, _bluebird.reduce)(uiExports.injectedVarsReplacers, (() => {
            var _ref3 = _asyncToGenerator(function* (acc, replacer) {
              return yield replacer(acc, request, server);
            });

            return function (_x5, _x6) {
              return _ref3.apply(this, arguments);
            };
          })(), (0, _lodash.defaults)(injectedVarsOverrides, (yield app.getInjectedVars()) || {}, uiExports.defaultInjectedVars))
        };
      });

      return function getKibanaPayload(_x4) {
        return _ref2.apply(this, arguments);
      };
    })();

    let renderApp = (() => {
      var _ref4 = _asyncToGenerator(function* ({ app, reply, includeUserProvidedConfig = true, injectedVarsOverrides = {} }) {
        try {
          const request = reply.request;
          const translations = yield uiI18n.getTranslationsForRequest(request);

          return reply.view(app.templateName, {
            app,
            kibanaPayload: yield getKibanaPayload({
              app,
              request,
              includeUserProvidedConfig,
              injectedVarsOverrides
            }),
            bundlePath: `${config.get('server.basePath')}/bundles`,
            i18n: function i18n(key) {
              return _lodash._.get(translations, key, '');
            }
          });
        } catch (err) {
          reply(err);
        }
      });

      return function renderApp(_x7) {
        return _ref4.apply(this, arguments);
      };
    })();

    const uiExports = kbnServer.uiExports = new _ui_exports2.default({
      urlBasePath: config.get('server.basePath')
    });

    const uiI18n = kbnServer.uiI18n = new _ui_i18n.UiI18n(config.get('i18n.defaultLocale'));
    uiI18n.addUiExportConsumer(uiExports);

    const bundlerEnv = new _ui_bundler_env2.default(config.get('optimize.bundleDir'));
    bundlerEnv.addContext('env', config.get('env.name'));
    bundlerEnv.addContext('urlBasePath', config.get('server.basePath'));
    bundlerEnv.addContext('sourceMaps', config.get('optimize.sourceMaps'));
    bundlerEnv.addContext('kbnVersion', config.get('pkg.version'));
    bundlerEnv.addContext('buildNum', config.get('pkg.buildNum'));
    uiExports.addConsumer(bundlerEnv);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = kbnServer.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const plugin = _step.value;

        uiExports.consumePlugin(plugin);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    const bundles = kbnServer.bundles = new _ui_bundle_collection2.default(bundlerEnv, config.get('optimize.bundleFilter'));

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = uiExports.getAllApps()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const app = _step2.value;

        bundles.addApp(app);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = uiExports.getBundleProviders()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        const gen = _step3.value;

        const bundle = yield gen(_ui_bundle2.default, bundlerEnv, uiExports.getAllApps(), kbnServer.plugins);
        if (bundle) bundles.add(bundle);
      }

      // render all views from the ui/views directory
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    server.setupViews((0, _path.resolve)(__dirname, 'views'));

    server.route({
      path: '/app/{id}',
      method: 'GET',
      handler(req, reply) {
        return _asyncToGenerator(function* () {
          const id = req.params.id;
          const app = uiExports.apps.byId[id];
          if (!app) return reply(_boom2.default.notFound('Unknown app ' + id));

          try {
            if (kbnServer.status.isGreen()) {
              yield reply.renderApp(app);
            } else {
              yield reply.renderStatusPage();
            }
          } catch (err) {
            reply(_boom2.default.wrap(err));
          }
        })();
      }
    });

    server.decorate('reply', 'renderApp', function (app, injectedVarsOverrides) {
      return renderApp({
        app,
        reply: this,
        includeUserProvidedConfig: true,
        injectedVarsOverrides
      });
    });

    server.decorate('reply', 'renderAppWithDefaultConfig', function (app) {
      return renderApp({
        app,
        reply: this,
        includeUserProvidedConfig: false
      });
    });
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();
