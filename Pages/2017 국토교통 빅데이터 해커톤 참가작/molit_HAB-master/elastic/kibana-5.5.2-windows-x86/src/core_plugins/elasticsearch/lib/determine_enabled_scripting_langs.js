'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.determineEnabledScriptingLangs = determineEnabledScriptingLangs;

var _lodash = require('lodash');

function determineEnabledScriptingLangs(callDataAsKibanaUser) {
  return callDataAsKibanaUser('cluster.getSettings', {
    include_defaults: true,
    filter_path: '**.script.engine.*.inline'
  }).then(esResponse => {
    const langs = (0, _lodash.get)(esResponse, 'defaults.script.engine', {});
    const inlineLangs = (0, _lodash.pick)(langs, lang => lang.inline === 'true');
    const supportedLangs = (0, _lodash.omit)(inlineLangs, 'mustache');
    return (0, _lodash.keys)(supportedLangs);
  });
}
