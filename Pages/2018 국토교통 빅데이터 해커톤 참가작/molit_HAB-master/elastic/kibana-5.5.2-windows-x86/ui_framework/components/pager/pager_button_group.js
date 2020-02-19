'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.KuiPagerButtonGroup = KuiPagerButtonGroup;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('../button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function KuiPagerButtonGroup(_ref) {
  let className = _ref.className,
      onPrevious = _ref.onPrevious,
      onNext = _ref.onNext,
      hasNext = _ref.hasNext,
      hasPrevious = _ref.hasPrevious,
      rest = _objectWithoutProperties(_ref, ['className', 'onPrevious', 'onNext', 'hasNext', 'hasPrevious']);

  return _react2.default.createElement(
    _button.KuiButtonGroup,
    _extends({ isUnited: true, className: className }, rest),
    _react2.default.createElement(_button.KuiButton, {
      'aria-label': 'Show previous page',
      'data-test-subj': 'pagerPreviousButton',
      buttonType: 'basic',
      onClick: onPrevious,
      disabled: !hasPrevious,
      icon: _react2.default.createElement(_button.KuiButtonIcon, { type: 'previous' })
    }),
    _react2.default.createElement(_button.KuiButton, {
      'aria-label': 'Show next page',
      'data-test-subj': 'pagerNextButton',
      buttonType: 'basic',
      onClick: onNext,
      disabled: !hasNext,
      icon: _react2.default.createElement(_button.KuiButtonIcon, { type: 'next' })
    })
  );
}

KuiPagerButtonGroup.propTypes = {
  onPrevious: _react2.default.PropTypes.func.isRequired,
  onNext: _react2.default.PropTypes.func.isRequired,
  hasNext: _react2.default.PropTypes.bool.isRequired,
  hasPrevious: _react2.default.PropTypes.bool.isRequired,
  className: _react2.default.PropTypes.string
};
