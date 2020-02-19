'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleEsError = handleEsError;

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _elasticsearch$errors = _elasticsearch2.default.errors;
const ConnectionFault = _elasticsearch$errors.ConnectionFault,
      ServiceUnavailable = _elasticsearch$errors.ServiceUnavailable,
      NoConnections = _elasticsearch$errors.NoConnections,
      RequestTimeout = _elasticsearch$errors.RequestTimeout,
      Conflict = _elasticsearch$errors.Conflict,
      Forbidden = _elasticsearch$errors[403],
      NotFound = _elasticsearch$errors.NotFound,
      BadRequest = _elasticsearch$errors.BadRequest;
function handleEsError(error) {
  if (!(error instanceof Error)) {
    throw new Error('Expected an instance of Error');
  }

  const reason = (0, _lodash.get)(error, 'body.error.reason');

  if (error instanceof ConnectionFault || error instanceof ServiceUnavailable || error instanceof NoConnections || error instanceof RequestTimeout) {
    throw _boom2.default.serverTimeout();
  }

  if (error instanceof Conflict) {
    throw _boom2.default.conflict(reason);
  }

  if (error instanceof Forbidden) {
    throw _boom2.default.forbidden(reason);
  }

  if (error instanceof NotFound) {
    throw _boom2.default.notFound(reason);
  }

  if (error instanceof BadRequest) {
    throw _boom2.default.badRequest(reason);
  }

  throw error;
}
