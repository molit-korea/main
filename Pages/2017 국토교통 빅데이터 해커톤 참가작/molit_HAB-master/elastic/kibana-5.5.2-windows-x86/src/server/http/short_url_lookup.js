'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (server) {
  let updateMetadata = (() => {
    var _ref = _asyncToGenerator(function* (urlId, urlDoc, req) {
      var _server$plugins$elast = server.plugins.elasticsearch.getCluster('admin');

      const callWithRequest = _server$plugins$elast.callWithRequest;

      const kibanaIndex = server.config().get('kibana.index');

      try {
        yield callWithRequest(req, 'update', {
          index: kibanaIndex,
          type: 'url',
          id: urlId,
          body: {
            doc: {
              'accessDate': new Date(),
              'accessCount': urlDoc._source.accessCount + 1
            }
          }
        });
      } catch (err) {
        server.log('Warning: Error updating url metadata', err);
        //swallow errors. It isn't critical if there is no update.
      }
    });

    return function updateMetadata(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  })();

  let getUrlDoc = (() => {
    var _ref2 = _asyncToGenerator(function* (urlId, req) {
      const urlDoc = yield new Promise(function (resolve) {
        var _server$plugins$elast2 = server.plugins.elasticsearch.getCluster('admin');

        const callWithRequest = _server$plugins$elast2.callWithRequest;

        const kibanaIndex = server.config().get('kibana.index');

        callWithRequest(req, 'get', {
          index: kibanaIndex,
          type: 'url',
          id: urlId
        }).then(function (response) {
          resolve(response);
        }).catch(function () {
          resolve();
        });
      });

      return urlDoc;
    });

    return function getUrlDoc(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  })();

  let createUrlDoc = (() => {
    var _ref3 = _asyncToGenerator(function* (url, urlId, req) {
      const newUrlId = yield new Promise(function (resolve, reject) {
        var _server$plugins$elast3 = server.plugins.elasticsearch.getCluster('admin');

        const callWithRequest = _server$plugins$elast3.callWithRequest;

        const kibanaIndex = server.config().get('kibana.index');

        callWithRequest(req, 'index', {
          index: kibanaIndex,
          type: 'url',
          id: urlId,
          body: {
            url,
            'accessCount': 0,
            'createDate': new Date(),
            'accessDate': new Date()
          }
        }).then(function (response) {
          resolve(response._id);
        }).catch(function (err) {
          reject(err);
        });
      });

      return newUrlId;
    });

    return function createUrlDoc(_x6, _x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  })();

  function createUrlId(url) {
    const urlId = _crypto2.default.createHash('md5').update(url).digest('hex');

    return urlId;
  }

  return {
    generateUrlId(url, req) {
      return _asyncToGenerator(function* () {
        const urlId = createUrlId(url);
        const urlDoc = yield getUrlDoc(urlId, req);
        if (urlDoc) return urlId;

        return createUrlDoc(url, urlId, req);
      })();
    },
    getUrl(urlId, req) {
      return _asyncToGenerator(function* () {
        try {
          const urlDoc = yield getUrlDoc(urlId, req);
          if (!urlDoc) throw new Error('Requested shortened url does not exist in kibana index');

          updateMetadata(urlId, urlDoc, req);

          return urlDoc._source.url;
        } catch (err) {
          return '/';
        }
      })();
    }
  };
};

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = exports['default'];
