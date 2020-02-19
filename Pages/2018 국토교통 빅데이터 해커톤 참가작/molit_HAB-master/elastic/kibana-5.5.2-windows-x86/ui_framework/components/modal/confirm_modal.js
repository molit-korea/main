'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CANCEL_BUTTON = exports.CONFIRM_BUTTON = undefined;
exports.KuiConfirmModal = KuiConfirmModal;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _modal = require('./modal');

var _modal_footer = require('./modal_footer');

var _modal_header = require('./modal_header');

var _modal_header_title = require('./modal_header_title');

var _modal_body = require('./modal_body');

var _modal_body_text = require('./modal_body_text');

var _index = require('../index');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const CONFIRM_BUTTON = exports.CONFIRM_BUTTON = 'confirm';
const CANCEL_BUTTON = exports.CANCEL_BUTTON = 'cancel';

const CONFIRM_MODAL_BUTTONS = [CONFIRM_BUTTON, CANCEL_BUTTON];

function KuiConfirmModal(_ref) {
  let message = _ref.message,
      title = _ref.title,
      onCancel = _ref.onCancel,
      onConfirm = _ref.onConfirm,
      cancelButtonText = _ref.cancelButtonText,
      confirmButtonText = _ref.confirmButtonText,
      className = _ref.className,
      defaultFocusedButton = _ref.defaultFocusedButton,
      rest = _objectWithoutProperties(_ref, ['message', 'title', 'onCancel', 'onConfirm', 'cancelButtonText', 'confirmButtonText', 'className', 'defaultFocusedButton']);

  const onKeyDown = event => {
    // Treat the 'esc' key as a cancel indicator.
    if (event.keyCode === _services.ESC_KEY_CODE) {
      onCancel();
    }
  };

  const ariaLabel = rest['aria-label'];
  const dataTestSubj = rest['data-test-subj'];
  return _react2.default.createElement(
    _modal.KuiModal,
    {
      style: { 'width': '450px' },
      'data-tests-subj': dataTestSubj,
      'aria-label': ariaLabel,
      className: className,
      onKeyDown: onKeyDown
    },
    title ? _react2.default.createElement(
      _modal_header.KuiModalHeader,
      null,
      _react2.default.createElement(
        _modal_header_title.KuiModalHeaderTitle,
        { 'data-test-subj': 'confirmModalTitleText' },
        title
      )
    ) : null,
    _react2.default.createElement(
      _modal_body.KuiModalBody,
      null,
      _react2.default.createElement(
        _modal_body_text.KuiModalBodyText,
        { 'data-test-subj': 'confirmModalBodyText' },
        message
      )
    ),
    _react2.default.createElement(
      _modal_footer.KuiModalFooter,
      null,
      _react2.default.createElement(
        _index.KuiButton,
        {
          buttonType: 'hollow',
          autoFocus: defaultFocusedButton === CANCEL_BUTTON,
          'data-test-subj': 'confirmModalCancelButton',
          onClick: onCancel
        },
        cancelButtonText
      ),
      _react2.default.createElement(
        _index.KuiButton,
        {
          buttonType: 'primary',
          autoFocus: defaultFocusedButton === CONFIRM_BUTTON,
          'data-test-subj': 'confirmModalConfirmButton',
          onClick: onConfirm
        },
        confirmButtonText
      )
    )
  );
}

KuiConfirmModal.propTypes = {
  message: _propTypes2.default.string,
  title: _propTypes2.default.string,
  cancelButtonText: _propTypes2.default.string,
  confirmButtonText: _propTypes2.default.string,
  onCancel: _propTypes2.default.func,
  onConfirm: _propTypes2.default.func,
  dataTestSubj: _propTypes2.default.string,
  ariaLabel: _propTypes2.default.string,
  className: _propTypes2.default.string,
  defaultFocusedButton: _propTypes2.default.oneOf(CONFIRM_MODAL_BUTTONS)
};
