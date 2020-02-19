'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiI18n = undefined;

var _path = require('path');

var _lodash = require('lodash');

var _acceptLanguageParser = require('accept-language-parser');

var _acceptLanguageParser2 = _interopRequireDefault(_acceptLanguageParser);

var _i18n = require('./i18n');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function acceptLanguageHeaderToBCP47Tags(header) {
  return _acceptLanguageParser2.default.parse(header).map(lang => (0, _lodash.compact)([lang.code, lang.region, lang.script]).join('-'));
}

class UiI18n {
  constructor(defaultLocale = 'en') {
    this._i18n = new _i18n.I18n(defaultLocale);
    this._i18n.registerTranslations((0, _path.resolve)(__dirname, './translations/en.json'));
  }

  /**
   *  Fetch the language translations as defined by the request.
   *
   *  @param {Hapi.Request} request
   *  @returns {Promise<Object>} translations promise for an object where
   *                                          keys are translation keys and
   *                                          values are translations
   */
  getTranslationsForRequest(request) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const header = request.headers['accept-language'];
      const tags = acceptLanguageHeaderToBCP47Tags(header);
      const requestedTranslations = yield _this._i18n.getTranslations(...tags);
      const defaultTranslations = yield _this._i18n.getTranslationsForDefaultLocale();
      return (0, _lodash.defaults)({}, requestedTranslations, defaultTranslations);
    })();
  }

  /**
  *  uiExport consumers help the uiExports module know what to
  *  do with the uiExports defined by each plugin.
  *
  *  This consumer will allow plugins to define export with the
  *  "translations" type like so:
  *
  *    new kibana.Plugin({
  *      uiExports: {
  *        translations: [
  *          resolve(__dirname, './translations/es.json'),
  *        ],
  *      },
  *    });
  *
  */
  addUiExportConsumer(uiExports) {
    uiExports.addConsumerForType('translations', (plugin, translations) => {
      translations.forEach(path => {
        this._i18n.registerTranslations(path);
      });
    });
  }

  /**
     Refer to I18n.getAllTranslations()
   */
  getAllTranslations() {
    return this._i18n.getAllTranslations();
  }
}
exports.UiI18n = UiI18n;
