'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (kbnServer, server, config) {
  // this mixin is used outside of the kbn server, so it MUST work without a full kbnServer object.
  kbnServer = null;

  const host = config.get('server.host');
  const port = config.get('server.port');

  const connectionOptions = {
    host,
    port,
    state: {
      strictHeader: false
    },
    routes: {
      cors: config.get('server.cors'),
      payload: {
        maxBytes: config.get('server.maxPayloadBytes')
      },
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  };

  const useSsl = config.get('server.ssl.enabled');

  // not using https? well that's easy!
  if (!useSsl) {
    server.connection(connectionOptions);
    return;
  }

  server.connection(_extends({}, connectionOptions, {
    tls: true,
    listener: _httpolyglot2.default.createServer({
      key: (0, _fs.readFileSync)(config.get('server.ssl.key')),
      cert: (0, _fs.readFileSync)(config.get('server.ssl.certificate')),
      ca: (0, _lodash.map)(config.get('server.ssl.certificateAuthorities'), _fs.readFileSync),
      passphrase: config.get('server.ssl.keyPassphrase'),

      ciphers: config.get('server.ssl.cipherSuites').join(':'),
      // We use the server's cipher order rather than the client's to prevent the BEAST attack
      honorCipherOrder: true,
      secureOptions: (0, _secure_options2.default)(config.get('server.ssl.supportedProtocols'))
    })
  }));

  server.ext('onRequest', function (req, reply) {
    // A request sent through a HapiJS .inject() doesn't have a socket associated with the request
    // which causes a failure.
    if (!req.raw.req.socket || req.raw.req.socket.encrypted) {
      reply.continue();
    } else {
      reply.redirect((0, _url.format)({
        port,
        protocol: 'https',
        hostname: host,
        pathname: req.url.pathname,
        search: req.url.search
      }));
    }
  });
};

var _fs = require('fs');

var _url = require('url');

var _httpolyglot = require('@elastic/httpolyglot');

var _httpolyglot2 = _interopRequireDefault(_httpolyglot);

var _lodash = require('lodash');

var _secure_options = require('./secure_options');

var _secure_options2 = _interopRequireDefault(_secure_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
