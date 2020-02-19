'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _ui_nav_link = require('./ui_nav_link');

var _ui_nav_link2 = _interopRequireDefault(_ui_nav_link);

var _collection = require('../utils/collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const inOrderCache = Symbol('inOrder');

class UiNavLinkCollection extends _collection2.default {

  constructor(uiExports) {
    super();
    this.uiExports = uiExports;
  }

  new(spec) {
    const link = new _ui_nav_link2.default(this.uiExports, spec);
    this[inOrderCache] = null;
    this.add(link);
    return link;
  }

  get inOrder() {
    if (!this[inOrderCache]) {
      this[inOrderCache] = (0, _lodash.sortBy)([...this], 'order');
    }

    return this[inOrderCache];
  }

  delete(value) {
    this[inOrderCache] = null;
    return super.delete(value);
  }

}
exports.default = UiNavLinkCollection;
module.exports = exports['default'];
