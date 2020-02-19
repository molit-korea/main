'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogInterceptor = undefined;

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doTagsMatch(event, tags) {
  return (0, _lodash.isEqual)((0, _lodash.get)(event, 'tags'), tags);
}

// converts the given event into a debug log if it's an error of the given type
function downgradeIfErrorMatches(errorType, event) {
  const isClientError = doTagsMatch(event, ['connection', 'client', 'error']);
  const matchesErrorType = isClientError && (0, _lodash.get)(event, 'data.errno') === errorType;

  if (!matchesErrorType) return null;

  const errorTypeTag = errorType.toLowerCase();

  return {
    event: 'log',
    pid: event.pid,
    timestamp: event.timestamp,
    tags: ['debug', 'connection', errorTypeTag],
    data: `${errorType}: Socket was closed by the client (probably the browser) before it could be read completely`
  };
}

class LogInterceptor extends _stream2.default.Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    });
  }

  /**
   *  Since the upgrade to hapi 14, any socket read
   *  error is surfaced as a generic "client error"
   *  but "ECONNRESET" specifically is not useful for the
   *  logs unless you are trying to debug edge-case behaviors.
   *
   *  For that reason, we downgrade this from error to debug level
   *
   *  @param {object} - log event
   */
  downgradeIfEconnreset(event) {
    return downgradeIfErrorMatches('ECONNRESET', event);
  }

  /**
   *  Since the upgrade to hapi 14, any socket write
   *  error is surfaced as a generic "client error"
   *  but "EPIPE" specifically is not useful for the
   *  logs unless you are trying to debug edge-case behaviors.
   *
   *  For that reason, we downgrade this from error to debug level
   *
   *  @param {object} - log event
   */
  downgradeIfEpipe(event) {
    return downgradeIfErrorMatches('EPIPE', event);
  }

  /**
   *  Since the upgrade to hapi 14, any socket write
   *  error is surfaced as a generic "client error"
   *  but "ECANCELED" specifically is not useful for the
   *  logs unless you are trying to debug edge-case behaviors.
   *
   *  For that reason, we downgrade this from error to debug level
   *
   *  @param {object} - log event
   */
  downgradeIfEcanceled(event) {
    return downgradeIfErrorMatches('ECANCELED', event);
  }

  _transform(event, enc, next) {
    const downgraded = this.downgradeIfEconnreset(event) || this.downgradeIfEpipe(event) || this.downgradeIfEcanceled(event);

    this.push(downgraded || event);
    next();
  }
}
exports.LogInterceptor = LogInterceptor;
