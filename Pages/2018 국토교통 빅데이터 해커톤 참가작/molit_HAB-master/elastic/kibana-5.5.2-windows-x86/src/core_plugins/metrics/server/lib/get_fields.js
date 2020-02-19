'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParams = getParams;
exports.handleResponse = handleResponse;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getParams(req) {
  const index = req.query.index || '*';
  return {
    index,
    fields: ['*'],
    ignoreUnavailable: false,
    allowNoIndices: false,
    includeDefaults: true
  };
}

function handleResponse(resp) {
  return _lodash2.default.reduce(resp, (acc, index) => {
    _lodash2.default.each(index.mappings, type => {
      _lodash2.default.each(type, (field, fullName) => {
        const name = _lodash2.default.last(fullName.split(/\./));
        const enabled = _lodash2.default.get(field, `mapping.${name}.enabled`, true);
        const fieldType = _lodash2.default.get(field, `mapping.${name}.type`);
        if (enabled && fieldType) {
          acc.push({
            name: _lodash2.default.get(field, 'full_name', fullName),
            type: fieldType
          });
        }
      });
    });
    return (0, _lodash2.default)(acc).sortBy('name').uniq(row => row.name).value();
  }, []);
}

function getFields(req) {
  var _req$server$plugins$e = req.server.plugins.elasticsearch.getCluster('data');

  const callWithRequest = _req$server$plugins$e.callWithRequest;

  const params = getParams(req);
  return callWithRequest(req, 'indices.getFieldMapping', params).then(handleResponse);
}

exports.default = getFields;
