'use strict';

var _path = require('path');

var _bluebird = require('bluebird');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const read = (0, _bluebird.promisify)(require('fs').readFile);
const write = (0, _bluebird.promisify)(require('fs').writeFile);
const unlink = (0, _bluebird.promisify)(require('fs').unlink);
const stat = (0, _bluebird.promisify)(require('fs').stat);

module.exports = class UiBundle {
  constructor(opts) {

    opts = opts || {};
    this.id = opts.id;
    this.modules = opts.modules;
    this.template = opts.template;
    this.env = opts.env;

    const pathBase = (0, _path.join)(this.env.workingDir, this.id);
    this.entryPath = `${pathBase}.entry.js`;
    this.outputPath = `${pathBase}.bundle.js`;
  }

  renderContent() {
    return this.template({
      env: this.env,
      bundle: this
    });
  }

  readEntryFile() {
    var _this = this;

    return _asyncToGenerator(function* () {
      try {
        const content = yield read(_this.entryPath);
        return content.toString('utf8');
      } catch (e) {
        return null;
      }
    })();
  }

  writeEntryFile() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield write(_this2.entryPath, _this2.renderContent(), { encoding: 'utf8' });
    })();
  }

  clearBundleFile() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      try {
        yield unlink(_this3.outputPath);
      } catch (e) {
        return null;
      }
    })();
  }

  checkForExistingOutput() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      try {
        yield stat(_this4.outputPath);
        return true;
      } catch (e) {
        return false;
      }
    })();
  }

  toJSON() {
    return {
      id: this.id,
      modules: this.modules,
      entryPath: this.entryPath,
      outputPath: this.outputPath
    };
  }
};
