'use strict';

var _ui_bundle = require('./ui_bundle');

var _ui_bundle2 = _interopRequireDefault(_ui_bundle);

var _app_entry_template = require('./app_entry_template');

var _app_entry_template2 = _interopRequireDefault(_app_entry_template);

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _minimatch = require('minimatch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const mkdirp = (0, _bluebird.promisify)(require('mkdirp'));

class UiBundleCollection {
  constructor(bundlerEnv, filter) {
    this.each = [];
    this.env = bundlerEnv;
    this.filter = (0, _minimatch.makeRe)(filter || '*', {
      noglobstar: true,
      noext: true,
      matchBase: true
    });
  }

  add(bundle) {
    if (!(bundle instanceof _ui_bundle2.default)) {
      throw new TypeError('expected bundle to be an instance of UiBundle');
    }

    if (this.filter.test(bundle.id)) {
      this.each.push(bundle);
    }
  }

  addApp(app) {
    this.add(new _ui_bundle2.default({
      id: app.id,
      modules: app.getModules(),
      template: _app_entry_template2.default,
      env: this.env
    }));
  }

  desc() {
    switch (this.each.length) {
      case 0:
        return '0 bundles';
      case 1:
        return `bundle for ${this.each[0].id}`;
      default:
        const ids = this.getIds();
        const last = ids.pop();
        const commas = ids.join(', ');
        return `bundles for ${commas} and ${last}`;
    }
  }

  ensureDir() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield mkdirp(_this.env.workingDir);
    })();
  }

  writeEntryFiles() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.ensureDir();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this2.each[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const bundle = _step.value;

          const existing = yield bundle.readEntryFile();
          const expected = bundle.renderContent();

          if (existing !== expected) {
            yield bundle.writeEntryFile();
            yield bundle.clearBundleFile();
          }
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
    })();
  }

  getInvalidBundles() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const invalids = new UiBundleCollection(_this3.env);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this3.each[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          const bundle = _step2.value;

          const exists = yield bundle.checkForExistingOutput();
          if (!exists) {
            invalids.add(bundle);
          }
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

      return invalids;
    })();
  }

  toWebpackEntries() {
    return (0, _lodash.transform)(this.each, function (entries, bundle) {
      entries[bundle.id] = bundle.entryPath;
    }, {});
  }

  getIds() {
    return (0, _lodash.pluck)(this.each, 'id');
  }

  toJSON() {
    return this.each;
  }
}

module.exports = UiBundleCollection;
