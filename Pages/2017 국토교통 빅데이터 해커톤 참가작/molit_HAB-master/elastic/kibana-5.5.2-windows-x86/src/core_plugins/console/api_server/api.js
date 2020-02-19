"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

/**
 *
 * @param name
 */
function Api(name) {
  this.globalRules = {};
  this.endpoints = {};
  this.name = name;
}

(function (cls) {
  cls.addGlobalAutocompleteRules = function (parentNode, rules) {
    this.globalRules[parentNode] = rules;
  };

  cls.addEndpointDescription = function (endpoint, description) {
    if (this.endpoints[endpoint]) {
      throw new Error("endpoint [" + endpoint + "] is already registered");
    }

    var copiedDescription = {};
    _lodash2.default.extend(copiedDescription, description || {});
    _lodash2.default.defaults(copiedDescription, {
      id: endpoint,
      patterns: [endpoint],
      methods: ['GET']
    });
    this.endpoints[endpoint] = copiedDescription;
  };

  cls.asJson = function () {
    return {
      "name": this.name,
      "globals": this.globalRules,
      "endpoints": this.endpoints
    };
  };
})(Api.prototype);

module.exports = Api;
