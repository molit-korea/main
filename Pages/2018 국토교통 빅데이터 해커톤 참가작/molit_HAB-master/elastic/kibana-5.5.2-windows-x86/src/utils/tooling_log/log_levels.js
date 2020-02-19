'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLogLevel = parseLogLevel;

const LEVELS = ['silent', 'error', 'warning', 'info', 'debug', 'verbose'];

function parseLogLevel(name) {
  const i = LEVELS.indexOf(name);

  if (i === -1) {
    const msg = `Invalid log level "${name}" ` + `(expected one of ${LEVELS.join(',')})`;
    throw new Error(msg);
  }

  const flags = {};
  LEVELS.forEach((level, levelI) => {
    flags[level] = levelI <= i;
  });

  return { name, flags };
}
