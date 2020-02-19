'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCreateRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createCreateRoute = exports.createCreateRoute = prereqs => {
  return {
    path: '/api/saved_objects/{type}',
    method: 'POST',
    config: {
      pre: [prereqs.getSavedObjectsClient],
      validate: {
        params: _joi2.default.object().keys({
          type: _joi2.default.string().required()
        }).required(),
        payload: _joi2.default.object({
          attributes: _joi2.default.object().required()
        }).required()
      },
      handler(request, reply) {
        const savedObjectsClient = request.pre.savedObjectsClient;
        const type = request.params.type;
        const attributes = request.payload.attributes;


        reply(savedObjectsClient.create(type, attributes));
      }
    }
  };
};
