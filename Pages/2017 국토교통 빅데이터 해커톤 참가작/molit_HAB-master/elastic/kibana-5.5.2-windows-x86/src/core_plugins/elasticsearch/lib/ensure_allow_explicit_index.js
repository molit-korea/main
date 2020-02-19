'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let ensureAllowExplicitIndex = exports.ensureAllowExplicitIndex = (() => {
  var _ref = _asyncToGenerator(function* (callWithInternalUser, config) {
    const resp = yield callWithInternalUser('mget', {
      ignore: [400],
      body: {
        docs: [{
          _index: config.get('kibana.index'),
          _type: 'config',
          _id: config.get('pkg.version')
        }]
      }
    });

    if (!resp.error) {
      return true;
    }

    const error = resp.error || {};
    const errorReason = error.reason || '';

    const isArgError = error.type === 'illegal_argument_exception';
    const isExplicitIndexException = isArgError && errorReason.includes('explicit index');

    if (isExplicitIndexException) {
      throw new Error('Kibana must be able to specify the index within Elasticsearch multi-requests ' + '(rest.action.multi.allow_explicit_index=true).');
    }

    throw new Error('Unable to ensure that rest.action.multi.allow_explicit_index=true: ' + `[${error.type}] ${errorReason}`);
  });

  return function ensureAllowExplicitIndex(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
