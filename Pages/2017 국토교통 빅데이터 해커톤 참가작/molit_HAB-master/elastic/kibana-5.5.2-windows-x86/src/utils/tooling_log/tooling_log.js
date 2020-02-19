'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createToolingLog = createToolingLog;

var _util = require('util');

var _stream = require('stream');

var _ansicolors = require('ansicolors');

var _log_levels = require('./log_levels');

function createToolingLog(initialLogLevelName = 'silent') {
  // current log level (see logLevel.name and logLevel.flags) changed
  // with ToolingLog#setLevel(newLogLevelName);
  let logLevel = (0, _log_levels.parseLogLevel)(initialLogLevelName);

  // current indentation level, changed with ToolingLog#indent(delta)
  let indentString = '';

  class ToolingLog extends _stream.PassThrough {
    constructor() {
      super({ objectMode: true });
    }

    verbose(...args) {
      if (!logLevel.flags.verbose) return;
      this.write(' %s ', (0, _ansicolors.magenta)('sill'), (0, _util.format)(...args));
    }

    debug(...args) {
      if (!logLevel.flags.debug) return;
      this.write(' %s ', (0, _ansicolors.brightBlack)('debg'), (0, _util.format)(...args));
    }

    info(...args) {
      if (!logLevel.flags.info) return;
      this.write(' %s ', (0, _ansicolors.blue)('info'), (0, _util.format)(...args));
    }

    warning(...args) {
      if (!logLevel.flags.warning) return;
      this.write(' %s ', (0, _ansicolors.yellow)('warn'), (0, _util.format)(...args));
    }

    error(err) {
      if (!logLevel.flags.error) return;

      if (typeof err !== 'string' && !(err instanceof Error)) {
        err = new Error(`"${err}" thrown`);
      }

      this.write('%s ', (0, _ansicolors.red)('ERROR'), err.stack || err.message || err);
    }

    indent(delta = 0) {
      const width = Math.max(0, indentString.length + delta);
      indentString = ' '.repeat(width);
      return indentString.length;
    }

    getLevel() {
      return logLevel.name;
    }

    setLevel(newLogLevelName) {
      logLevel = (0, _log_levels.parseLogLevel)(newLogLevelName);
    }

    write(...args) {
      (0, _util.format)(...args).split('\n').forEach((line, i) => {
        const subLineIndent = i === 0 ? '' : '       ';
        const indent = !indentString ? '' : indentString.slice(0, -1) + (i === 0 && line[0] === '-' ? '└' : '│');
        super.write(`${indent}${subLineIndent}${line}\n`);
      });
    }
  }

  return new ToolingLog();
}
