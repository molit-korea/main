'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.KuiToolBarSearchBox = KuiToolBarSearchBox;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function KuiToolBarSearchBox(_ref) {
  let filter = _ref.filter,
      onFilter = _ref.onFilter,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, ['filter', 'onFilter', 'className']);

  function onChange(event) {
    onFilter(event.target.value);
  }
  const classes = (0, _classnames2.default)('kuiToolBarSearch', className);
  return _react2.default.createElement(
    'div',
    _extends({ className: classes }, rest),
    _react2.default.createElement(
      'div',
      { className: 'kuiToolBarSearchBox' },
      _react2.default.createElement('div', { className: 'kuiToolBarSearchBox__icon kuiIcon fa-search' }),
      _react2.default.createElement('input', {
        className: 'kuiToolBarSearchBox__input',
        type: 'text',
        placeholder: 'Search...',
        'aria-label': 'Filter',
        defaultValue: filter,
        onChange: onChange
      })
    )
  );
}

KuiToolBarSearchBox.propTypes = {
  filter: _react2.default.PropTypes.string,
  onFilter: _react2.default.PropTypes.func.isRequired
};
