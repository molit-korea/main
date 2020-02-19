'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ui_app = require('./ui_app');

var _ui_app2 = _interopRequireDefault(_ui_app);

var _collection = require('../utils/collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const byIdCache = Symbol('byId');

module.exports = class UiAppCollection extends _collection2.default {

  constructor(uiExports, parent) {
    super();

    this.uiExports = uiExports;

    if (!parent) {
      this.claimedIds = [];
      this.hidden = new UiAppCollection(uiExports, this);
    } else {
      this.claimedIds = parent.claimedIds;
    }
  }

  new(spec) {
    if (this.hidden && spec.hidden) {
      return this.hidden.new(spec);
    }

    const app = new _ui_app2.default(this.uiExports, spec);

    if (_lodash2.default.includes(this.claimedIds, app.id)) {
      throw new Error('Unable to create two apps with the id ' + app.id + '.');
    } else {
      this.claimedIds.push(app.id);
    }

    this[byIdCache] = null;
    this.add(app);
    return app;
  }

  get byId() {
    return this[byIdCache] || (this[byIdCache] = _lodash2.default.indexBy([...this], 'id'));
  }

};
