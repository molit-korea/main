'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MappingsCollection = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MappingsCollection {
  constructor() {
    this.getCombined = () => {
      return this._currentMappings;
    };

    this.register = (newMappings, options = {}) => {
      Object.keys(this._currentMappings).forEach(key => {
        if (newMappings.hasOwnProperty(key)) {
          const pluginPartial = options.plugin ? `registered by plugin ${options.plugin} ` : '';
          throw new Error(`Mappings for ${key} ${pluginPartial}have already been defined`);
          return;
        }
      });
      Object.assign(this._currentMappings, newMappings);
    };

    this._defaultMappings = {
      '_default_': {
        'dynamic': 'strict'
      },
      config: {
        dynamic: true,
        properties: {
          buildNum: {
            type: 'keyword'
          }
        }
      }
    };
    this._currentMappings = _lodash2.default.cloneDeep(this._defaultMappings);
  }

}

exports.MappingsCollection = MappingsCollection;
