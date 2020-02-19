'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KuiButtonGroup = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KuiButtonGroup = props => {
  const classes = (0, _classnames2.default)('kuiButtonGroup', {
    'kuiButtonGroup--united': props.isUnited
  });

  return _react2.default.createElement(
    'div',
    { className: classes },
    props.children
  );
};

KuiButtonGroup.propTypes = {
  children: _react.PropTypes.node,
  isUnited: _react.PropTypes.bool
};

exports.KuiButtonGroup = KuiButtonGroup;
