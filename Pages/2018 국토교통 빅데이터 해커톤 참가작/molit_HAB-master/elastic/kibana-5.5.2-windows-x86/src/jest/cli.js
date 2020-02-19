'use strict';

var _jest = require('jest');

var _jest2 = _interopRequireDefault(_jest);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const argv = process.argv.slice(2);

argv.push('--config', JSON.stringify(_config.config));

_jest2.default.run(argv);
