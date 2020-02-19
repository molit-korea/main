'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDeleteRoute = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createDeleteRoute = exports.createDeleteRoute = prereqs => ({
  path: '/api/saved_objects/{type}/{id}',
  method: 'DELETE',
  config: {
    pre: [prereqs.getSavedObjectsClient],
    validate: {
      params: _joi2.default.object().keys({
        type: _joi2.default.string().required(),
        id: _joi2.default.string().required()
      }).required()
    },
    handler(request, reply) {
      const savedObjectsClient = request.pre.savedObjectsClient;
      var _request$params = request.params;
      const type = _request$params.type,
            id = _request$params.id;


      reply(savedObjectsClient.delete(type, id));
    }
  }
});
