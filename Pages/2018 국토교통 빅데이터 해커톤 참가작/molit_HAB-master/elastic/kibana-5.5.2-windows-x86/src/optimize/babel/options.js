'use strict';

var _require = require('./helpers');

const nodePreset = _require.nodePreset,
      webpackPreset = _require.webpackPreset,
      buildIgnore = _require.buildIgnore;


const nodeOptions = {
  presets: [nodePreset],
  ignore: buildIgnore
};

exports.webpack = {
  presets: [webpackPreset]
};

exports.node = nodeOptions;

exports.registerNodeOptions = function () {
  require('babel-register')(nodeOptions);
};
