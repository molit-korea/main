'use strict';

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('@elastic/numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _ansicolors = require('ansicolors');

var _ansicolors2 = _interopRequireDefault(_ansicolors);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _apply_filters_to_keys = require('./apply_filters_to_keys');

var _apply_filters_to_keys2 = _interopRequireDefault(_apply_filters_to_keys);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serializeError(err) {
  return {
    message: err.message,
    name: err.name,
    stack: err.stack,
    code: err.code,
    signal: err.signal
  };
}

const levelColor = function levelColor(code) {
  if (code < 299) return _ansicolors2.default.green(code);
  if (code < 399) return _ansicolors2.default.yellow(code);
  if (code < 499) return _ansicolors2.default.magenta(code);
  return _ansicolors2.default.red(code);
};

module.exports = class TransformObjStream extends _stream2.default.Transform {
  constructor(config) {
    super({
      readableObjectMode: false,
      writableObjectMode: true
    });
    this.config = config;
  }

  filter(data) {
    if (!this.config.filter) return data;
    return (0, _apply_filters_to_keys2.default)(data, this.config.filter);
  }

  _transform(event, enc, next) {
    const data = this.filter(this.readEvent(event));
    this.push(this.format(data) + '\n');
    next();
  }

  readEvent(event) {
    const data = {
      type: event.event,
      '@timestamp': _moment2.default.utc(event.timestamp).format(),
      tags: [].concat(event.tags || []),
      pid: event.pid
    };

    if (data.type === 'response') {
      _lodash2.default.defaults(data, _lodash2.default.pick(event, ['method', 'statusCode']));

      data.req = {
        url: event.path,
        method: event.method,
        headers: event.headers,
        remoteAddress: event.source.remoteAddress,
        userAgent: event.source.remoteAddress,
        referer: event.source.referer
      };

      let contentLength = 0;
      if (typeof event.responsePayload === 'object') {
        contentLength = (0, _jsonStringifySafe2.default)(event.responsePayload).length;
      } else {
        contentLength = String(event.responsePayload).length;
      }

      data.res = {
        statusCode: event.statusCode,
        responseTime: event.responseTime,
        contentLength: contentLength
      };

      const query = _querystring2.default.stringify(event.query);
      if (query) data.req.url += '?' + query;

      data.message = data.req.method.toUpperCase() + ' ';
      data.message += data.req.url;
      data.message += ' ';
      data.message += levelColor(data.res.statusCode);
      data.message += ' ';
      data.message += _ansicolors2.default.brightBlack(data.res.responseTime + 'ms');
      data.message += _ansicolors2.default.brightBlack(' - ' + (0, _numeral2.default)(contentLength).format('0.0b'));
    } else if (data.type === 'ops') {
      _lodash2.default.defaults(data, _lodash2.default.pick(event, ['pid', 'os', 'proc', 'load']));
      data.message = _ansicolors2.default.brightBlack('memory: ');
      data.message += (0, _numeral2.default)(data.proc.mem.heapUsed).format('0.0b');
      data.message += ' ';
      data.message += _ansicolors2.default.brightBlack('uptime: ');
      data.message += (0, _numeral2.default)(data.proc.uptime).format('00:00:00');
      data.message += ' ';
      data.message += _ansicolors2.default.brightBlack('load: [');
      data.message += data.os.load.map(function (val) {
        return (0, _numeral2.default)(val).format('0.00');
      }).join(' ');
      data.message += _ansicolors2.default.brightBlack(']');
      data.message += ' ';
      data.message += _ansicolors2.default.brightBlack('delay: ');
      data.message += (0, _numeral2.default)(data.proc.delay).format('0.000');
    } else if (data.type === 'error') {
      data.level = 'error';
      data.message = event.error.message;
      data.error = serializeError(event.error);
      data.url = event.url;
    } else if (event.data instanceof Error) {
      data.level = _lodash2.default.contains(event.tags, 'fatal') ? 'fatal' : 'error';
      data.message = event.data.message;
      data.error = serializeError(event.data);
    } else if (_lodash2.default.isPlainObject(event.data) && event.data.tmpl) {
      _lodash2.default.assign(data, event.data);
      data.tmpl = undefined;
      data.message = _lodash2.default.template(event.data.tmpl)(event.data);
    } else {
      data.message = _lodash2.default.isString(event.data) ? event.data : (0, _util.inspect)(event.data);
    }
    return data;
  }
};
