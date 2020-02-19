'use strict';

var _bluebird = require('bluebird');

module.exports = class WeirdControlFlow {
  constructor() {
    this.handlers = [];
  }

  get() {
    return (0, _bluebird.fromNode)(cb => {
      if (this.ready) return cb();
      this.handlers.push(cb);
      this.start();
    });
  }

  work(work) {
    this._work = work;
    this.stop();

    if (this.handlers.length) {
      this.start();
    }
  }

  start() {
    if (this.running) return;
    this.stop();
    if (this._work) {
      this.running = true;
      this._work();
    }
  }

  stop() {
    this.ready = false;
    this.error = false;
    this.running = false;
  }

  success(...args) {
    this.stop();
    this.ready = true;
    this._flush(args);
  }

  failure(err) {
    this.stop();
    this.error = err;
    this._flush([err]);
  }

  _flush(args) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.handlers.splice(0)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const fn = _step.value;

        fn.apply(null, args);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
};
