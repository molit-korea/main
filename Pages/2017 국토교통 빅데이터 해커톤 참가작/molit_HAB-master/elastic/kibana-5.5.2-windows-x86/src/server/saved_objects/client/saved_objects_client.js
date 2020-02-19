'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsClient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _lodash = require('lodash');

var _lib = require('./lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class SavedObjectsClient {
  constructor(kibanaIndex, callAdminCluster) {
    this._kibanaIndex = kibanaIndex;
    this._callAdminCluster = callAdminCluster;
  }

  create(type, body = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const response = yield _this._withKibanaIndex('index', { type, body });

      return {
        id: response._id,
        type: response._type,
        version: response._version,
        attributes: body
      };
    })();
  }

  /**
   * Creates multiple documents at once
   *
   * @param {array} objects
   * @param {object} options
   * @param {boolean} options.force - overrides existing documents
   * @returns {promise} Returns promise containing array of documents
   */
  bulkCreate(objects, options = {}) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const action = options.force === true ? 'index' : 'create';

      const body = objects.reduce(function (acc, object) {
        acc.push({ [action]: { _type: object.type, _id: object.id } });
        acc.push(object.attributes);

        return acc;
      }, []);

      return yield _this2._withKibanaIndex('bulk', { body }).then(function (resp) {
        return (0, _lodash.get)(resp, 'items', []).map(function (resp, i) {
          return {
            id: resp[action]._id,
            type: resp[action]._type,
            version: resp[action]._version,
            attributes: objects[i].attributes,
            error: resp[action].error ? { message: (0, _lodash.get)(resp[action], 'error.reason') } : undefined
          };
        });
      });
    })();
  }

  delete(type, id) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const response = yield _this3._withKibanaIndex('delete', {
        type,
        id,
        refresh: 'wait_for'
      });

      if ((0, _lodash.get)(response, 'found') === false) {
        throw _boom2.default.notFound();
      }
    })();
  }

  find(options = {}) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const search = options.search,
            searchFields = options.searchFields,
            type = options.type,
            fields = options.fields;
      var _options$perPage = options.perPage;
      const perPage = _options$perPage === undefined ? 20 : _options$perPage;
      var _options$page = options.page;
      const page = _options$page === undefined ? 1 : _options$page;


      const esOptions = {
        type,
        _source: fields,
        size: perPage,
        from: perPage * (page - 1),
        body: (0, _lib.createFindQuery)({ search, searchFields, type })
      };

      const response = yield _this4._withKibanaIndex('search', esOptions);

      return {
        saved_objects: (0, _lodash.get)(response, 'hits.hits', []).map(function (r) {
          return {
            id: r._id,
            type: r._type,
            version: r._version,
            attributes: r._source
          };
        }),
        total: (0, _lodash.get)(response, 'hits.total', 0),
        per_page: perPage,
        page

      };
    })();
  }

  /**
   * Returns an array of objects by id
   *
   * @param {array} objects - an array ids, or an array of objects containing id and optionally type
   * @returns {promise} Returns promise containing array of documents
   * @example
   *
   * bulkGet([
   *   { id: 'one', type: 'config' },
   *   { id: 'foo', type: 'index-pattern'
   * ])
   */
  bulkGet(objects = []) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      if (objects.length === 0) {
        return [];
      }

      const docs = objects.map(function (doc) {
        return { _type: (0, _lodash.get)(doc, 'type'), _id: (0, _lodash.get)(doc, 'id') };
      });

      const response = yield _this5._withKibanaIndex('mget', { body: { docs } }).then(function (resp) {
        return (0, _lodash.get)(resp, 'docs', []).filter(function (resp) {
          return resp.found;
        });
      });

      return response.map(function (r) {
        return {
          id: r._id,
          type: r._type,
          version: r._version,
          attributes: r._source
        };
      });
    })();
  }

  get(type, id) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const response = yield _this6._withKibanaIndex('get', {
        type,
        id
      });

      return {
        id: response._id,
        type: response._type,
        version: response._version,
        attributes: response._source
      };
    })();
  }

  update(type, id, attributes, options = {}) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const response = yield _this7._withKibanaIndex('update', {
        type,
        id,
        version: (0, _lodash.get)(options, 'version'),
        body: {
          doc: attributes
        },
        refresh: 'wait_for'
      });

      return {
        id: id,
        type: type,
        version: (0, _lodash.get)(response, '_version'),
        attributes: attributes
      };
    })();
  }

  _withKibanaIndex(method, params) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      try {
        return yield _this8._callAdminCluster(method, _extends({}, params, {
          index: _this8._kibanaIndex
        }));
      } catch (err) {
        throw (0, _lib.handleEsError)(err);
      }
    })();
  }
}
exports.SavedObjectsClient = SavedObjectsClient;
