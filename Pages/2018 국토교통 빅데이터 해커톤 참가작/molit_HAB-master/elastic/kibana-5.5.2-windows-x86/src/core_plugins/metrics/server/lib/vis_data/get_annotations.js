'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calculate_indices = require('./calculate_indices');

var _calculate_indices2 = _interopRequireDefault(_calculate_indices);

var _build_annotation_request = require('./build_annotation_request');

var _build_annotation_request2 = _interopRequireDefault(_build_annotation_request);

var _handle_annotation_response = require('./handle_annotation_response');

var _handle_annotation_response2 = _interopRequireDefault(_handle_annotation_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validAnnotation(annotation) {
  return annotation.index_pattern && annotation.time_field && annotation.fields && annotation.icon && annotation.template;
}

exports.default = (req, panel) => {
  var _req$server$plugins$e = req.server.plugins.elasticsearch.getCluster('data');

  const callWithRequest = _req$server$plugins$e.callWithRequest;

  return Promise.all(panel.annotations.filter(validAnnotation).map(annotation => {

    const indexPattern = annotation.index_pattern;
    const timeField = annotation.time_field;

    return (0, _calculate_indices2.default)(req, indexPattern, timeField).then(indices => {
      const bodies = [];

      if (!indices.length) throw new Error('missing-indices');
      bodies.push({
        index: indices,
        ignore: [404],
        timeout: '90s',
        requestTimeout: 90000,
        ignoreUnavailable: true
      });

      bodies.push((0, _build_annotation_request2.default)(req, panel, annotation));
      return bodies;
    });
  })).then(bodies => {
    if (!bodies.length) return { responses: [] };
    return callWithRequest(req, 'msearch', {
      body: bodies.reduce((acc, item) => acc.concat(item), [])
    });
  }).then(resp => {
    const results = {};
    panel.annotations.filter(validAnnotation).forEach((annotation, index) => {
      const data = resp.responses[index];
      results[annotation.id] = (0, _handle_annotation_response2.default)(data, annotation);
    });
    return results;
  }).catch(error => {
    if (error.message === 'missing-indices') return {};
    throw error;
  });
};

module.exports = exports['default'];
