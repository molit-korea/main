'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _ui_app_collection = require('./ui_app_collection');

var _ui_app_collection2 = _interopRequireDefault(_ui_app_collection);

var _ui_nav_link_collection = require('./ui_nav_link_collection');

var _ui_nav_link_collection2 = _interopRequireDefault(_ui_nav_link_collection);

var _ui_mappings = require('./ui_mappings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class UiExports {
  constructor({ urlBasePath }) {
    this.navLinks = new _ui_nav_link_collection2.default(this);
    this.apps = new _ui_app_collection2.default(this);
    this.aliases = {};
    this.urlBasePath = urlBasePath;
    this.exportConsumer = _lodash2.default.memoize(this.exportConsumer);
    this.consumers = [];
    this.bundleProviders = [];
    this.defaultInjectedVars = {};
    this.injectedVarsReplacers = [];
    this.mappings = new _ui_mappings.MappingsCollection();
  }

  consumePlugin(plugin) {
    plugin.apps = new _ui_app_collection2.default(this);

    const types = _lodash2.default.keys(plugin.uiExportsSpecs);
    if (!types) return false;

    const unkown = _lodash2.default.reject(types, this.exportConsumer, this);
    if (unkown.length) {
      throw new Error('unknown export types ' + unkown.join(', ') + ' in plugin ' + plugin.id);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.consumers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const consumer = _step.value;

        consumer.consumePlugin && consumer.consumePlugin(plugin);
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

    types.forEach(type => {
      this.exportConsumer(type)(plugin, plugin.uiExportsSpecs[type]);
    });
  }

  addConsumer(consumer) {
    this.consumers.push(consumer);
  }

  addConsumerForType(typeToConsume, consumer) {
    this.consumers.push({
      exportConsumer(uiExportType) {
        if (uiExportType === typeToConsume) {
          return consumer;
        }
      }
    });
  }

  exportConsumer(type) {
    var _this = this;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.consumers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const consumer = _step2.value;

        if (!consumer.exportConsumer) continue;
        const fn = consumer.exportConsumer(type);
        if (fn) return fn;
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

    switch (type) {
      case 'app':
      case 'apps':
        return (plugin, specs) => {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = [].concat(specs || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              const spec = _step3.value;


              const app = this.apps.new(_lodash2.default.defaults({}, spec, {
                id: plugin.id,
                urlBasePath: this.urlBasePath
              }));

              plugin.extendInit((server, options) => {
                // eslint-disable-line no-loop-func
                const wrapped = app.getInjectedVars;
                app.getInjectedVars = () => wrapped.call(plugin, server, options);
              });

              plugin.apps.add(app);
            }
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
        };

      case 'link':
      case 'links':
        return (plugin, specs) => {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = [].concat(specs || [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              const spec = _step4.value;

              this.navLinks.new(spec);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        };

      case 'visTypes':
      case 'fieldFormats':
      case 'spyModes':
      case 'chromeNavControls':
      case 'navbarExtensions':
      case 'managementSections':
      case 'devTools':
      case 'docViews':
      case 'hacks':
        return (plugin, spec) => {
          this.aliases[type] = _lodash2.default.union(this.aliases[type] || [], spec);
        };

      case 'visTypeEnhancers':
        return (plugin, spec) => {
          //used for plugins that augment capabilities of an existing visualization
          this.aliases.visTypes = _lodash2.default.union(this.aliases.visTypes || [], spec);
        };

      case 'bundle':
        return (plugin, spec) => {
          this.bundleProviders.push(spec);
        };

      case 'aliases':
        return (plugin, specs) => {
          _lodash2.default.forOwn(specs, (spec, adhocType) => {
            this.aliases[adhocType] = _lodash2.default.union(this.aliases[adhocType] || [], spec);
          });
        };

      case 'injectDefaultVars':
        return (plugin, injector) => {
          plugin.extendInit((() => {
            var _ref = _asyncToGenerator(function* (server, options) {
              _lodash2.default.merge(_this.defaultInjectedVars, (yield injector.call(plugin, server, options)));
            });

            return function (_x, _x2) {
              return _ref.apply(this, arguments);
            };
          })());
        };

      case 'mappings':
        return (plugin, mappings) => {
          this.mappings.register(mappings, { plugin: plugin.id });
        };

      case 'replaceInjectedVars':
        return (plugin, replacer) => {
          this.injectedVarsReplacers.push(replacer);
        };
    }
  }

  find(patterns) {
    const aliases = this.aliases;
    const names = _lodash2.default.keys(aliases);
    const matcher = _lodash2.default.partialRight(_minimatch2.default.filter, { matchBase: true });

    return _lodash2.default.chain(patterns).map(function (pattern) {
      return names.filter(matcher(pattern));
    }).flattenDeep().reduce(function (found, name) {
      return found.concat(aliases[name]);
    }, []).value();
  }

  getAllApps() {
    const apps = this.apps;

    return [...apps].concat(...apps.hidden);
  }

  getApp(id) {
    return this.apps.byId[id];
  }

  getHiddenApp(id) {
    return this.apps.hidden.byId[id];
  }

  getBundleProviders() {
    return this.bundleProviders;
  }
}

module.exports = UiExports;
