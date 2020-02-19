'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;

var _path = require('path');

const config = exports.config = {
  roots: ['<rootDir>/src/core_plugins/kibana/public/dashboard', '<rootDir>/ui_framework/'],
  collectCoverageFrom: ['ui_framework/services/**/*.js', '!ui_framework/services/index.js', '!ui_framework/services/**/*/index.js', 'ui_framework/components/**/*.js', '!ui_framework/components/index.js', '!ui_framework/components/**/*/index.js'],
  moduleNameMapper: {
    '^ui_framework/components': '<rootDir>/ui_framework/components'
  },
  coverageDirectory: '<rootDir>/target/jest-coverage',
  coverageReporters: ['html'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\]ui_framework[/\\\\](dist|doc_site|jest)[/\\\\]'],
  transform: {
    '^.+\\.js$': (0, _path.resolve)(__dirname, './babelTransform.js')
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.js$'],
  snapshotSerializers: ['<rootDir>/node_modules/enzyme-to-json/serializer']
};
