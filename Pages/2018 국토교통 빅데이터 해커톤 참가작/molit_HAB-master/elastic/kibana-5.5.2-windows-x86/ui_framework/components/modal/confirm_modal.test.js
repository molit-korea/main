'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _enzyme = require('enzyme');

var _required_props = require('../../test/required_props');

var _confirm_modal = require('./confirm_modal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let onConfirm;
let onCancel;

beforeEach(() => {
  onConfirm = _sinon2.default.spy();
  onCancel = _sinon2.default.spy();
});

test('renders KuiConfirmModal', () => {
  const component = (0, _enzyme.render)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
    message: 'This is a confirmation modal example',
    title: 'A confirmation modal',
    onCancel: () => {},
    onConfirm: onConfirm,
    cancelButtonText: 'Cancel Button Text',
    confirmButtonText: 'Confirm Button Text'
  }, _required_props.requiredProps)));
  expect(component).toMatchSnapshot();
});

test('onConfirm', () => {
  const component = (0, _enzyme.mount)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
    message: 'This is a confirmation modal example',
    title: 'A confirmation modal',
    onCancel: onCancel,
    onConfirm: onConfirm,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Confirm'
  }, _required_props.requiredProps)));
  component.find('[data-test-subj="confirmModalConfirmButton"]').simulate('click');
  _sinon2.default.assert.calledOnce(onConfirm);
  _sinon2.default.assert.notCalled(onCancel);
});

describe('onCancel', () => {
  test('triggerd by click', () => {
    const component = (0, _enzyme.mount)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
      message: 'This is a confirmation modal example',
      title: 'A confirmation modal',
      onCancel: onCancel,
      onConfirm: onConfirm,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm'
    }, _required_props.requiredProps)));
    component.find('[data-test-subj="confirmModalCancelButton"]').simulate('click');
    _sinon2.default.assert.notCalled(onConfirm);
    _sinon2.default.assert.calledOnce(onCancel);
  });

  test('triggered by esc key', () => {
    const component = (0, _enzyme.mount)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
      message: 'This is a confirmation modal example',
      title: 'A confirmation modal',
      onCancel: onCancel,
      onConfirm: onConfirm,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm'
    }, _required_props.requiredProps)));
    component.simulate('keydown', { keyCode: 27 });
    _sinon2.default.assert.notCalled(onConfirm);
    _sinon2.default.assert.calledOnce(onCancel);
  });
});

describe('defaultFocusedButton', () => {
  test('is cancel', () => {
    const component = (0, _enzyme.mount)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
      message: 'This is a confirmation modal example',
      title: 'A confirmation modal',
      onCancel: onCancel,
      onConfirm: onConfirm,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      defaultFocusedButton: _confirm_modal.CANCEL_BUTTON
    }, _required_props.requiredProps)));
    const button = component.find('[data-test-subj="confirmModalCancelButton"]').getDOMNode();
    expect(document.activeElement).toEqual(button);
  });

  test('is confirm', () => {
    const component = (0, _enzyme.mount)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
      message: 'This is a confirmation modal example',
      title: 'A confirmation modal',
      onCancel: onCancel,
      onConfirm: onConfirm,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      defaultFocusedButton: _confirm_modal.CONFIRM_BUTTON
    }, _required_props.requiredProps)));
    const button = component.find('[data-test-subj="confirmModalConfirmButton"]').getDOMNode();
    expect(document.activeElement).toEqual(button);
  });

  test('when not given focuses on the confirm button', () => {
    const component = (0, _enzyme.mount)(_react2.default.createElement(_confirm_modal.KuiConfirmModal, _extends({
      message: 'This is a confirmation modal example',
      title: 'A confirmation modal',
      onCancel: onCancel,
      onConfirm: onConfirm,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm'
    }, _required_props.requiredProps)));
    const button = component.find('[data-test-subj="confirmModalConfirmButton"]').getDOMNode();
    expect(document.activeElement).toEqual(button);
  });
});
