'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _keyboard_accessible = require('./keyboard_accessible');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('KuiKeyboardAccessible', () => {
  describe('throws an error', () => {
    let consoleStub;

    beforeEach(() => {
      consoleStub = _sinon2.default.stub(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    test(`when there's no child`, () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(_keyboard_accessible.KuiKeyboardAccessible, null);

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`needs to wrap an element with which the user interacts.`);
    });

    test('when the child is a button', () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('button', { onClick: () => {} })
      );

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`doesn't need to be used on a button.`);
    });

    test('when the child is a link with an href', () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('a', { href: '#', onClick: () => {} })
      );

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`doesn't need to be used on a link if it has a href attribute.`);
    });

    test(`when the child doesn't have an onClick prop`, () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', null)
      );

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`needs to wrap an element which has an onClick prop assigned.`);
    });

    test(`when the child's onClick prop isn't a function`, () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { onClick: 'notAFunction' })
      );

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`child's onClick prop needs to be a function.`);
    });

    test(`when the child has an onKeyDown prop`, () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { onClick: () => {}, onKeyDown: () => {} })
      );

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`child can't have an onKeyDown prop because the implementation will override it.`);
    });

    test(`when the child has an onKeyUp prop`, () => {
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { onClick: () => {}, onKeyUp: () => {} })
      );

      expect(consoleStub.calledOnce).toBe(true);
      expect(consoleStub.getCall(0).args[0]).toContain(`child can't have an onKeyUp prop because the implementation will override it.`);
    });
  });

  describe(`doesn't throw an error`, () => {
    test('when the element is a link without an href', () => {
      const consoleStub = _sinon2.default.stub(console, 'error');
      const component = // eslint-disable-line no-unused-vars
      _react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('a', { onClick: () => {} })
      );

      expect(consoleStub.called).toBe(false);
      console.error.restore();
    });
  });

  describe('adds accessibility attributes', () => {
    test('tabindex and role', () => {
      const $button = (0, _enzyme.render)(_react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { onClick: () => {} })
      ));

      expect($button).toMatchSnapshot();
    });
  });

  describe(`doesn't override pre-existing accessibility attributes`, () => {
    test('tabindex', () => {
      const $button = (0, _enzyme.render)(_react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { onClick: () => {}, tabIndex: '1' })
      ));

      expect($button).toMatchSnapshot();
    });

    test('role', () => {
      const $button = (0, _enzyme.render)(_react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { onClick: () => {}, role: 'submit' })
      ));

      expect($button).toMatchSnapshot();
    });
  });

  describe(`calls onClick`, () => {
    test(`on ENTER keyup`, () => {
      const onClickHandler = _sinon2.default.stub();

      const $button = (0, _enzyme.shallow)(_react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { 'data-div': true, onClick: onClickHandler })
      ));

      $button.find('[data-div]').simulate('keyup', {
        keyCode: _services.ENTER_KEY
      });

      _sinon2.default.assert.calledOnce(onClickHandler);
    });

    test(`on SPACE keyup`, () => {
      const onClickHandler = _sinon2.default.stub();

      const $button = (0, _enzyme.shallow)(_react2.default.createElement(
        _keyboard_accessible.KuiKeyboardAccessible,
        null,
        _react2.default.createElement('div', { 'data-div': true, onClick: onClickHandler })
      ));

      $button.find('[data-div]').simulate('keyup', {
        keyCode: _services.SPACE_KEY
      });

      _sinon2.default.assert.calledOnce(onClickHandler);
    });
  });
});
