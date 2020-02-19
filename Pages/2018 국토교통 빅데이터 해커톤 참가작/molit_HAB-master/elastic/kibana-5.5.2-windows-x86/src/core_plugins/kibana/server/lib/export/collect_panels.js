'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectPanels = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

let collectPanels = exports.collectPanels = (() => {
  var _ref = _asyncToGenerator(function* (savedObjectsClient, dashboard) {
    let panels;
    try {
      panels = JSON.parse((0, _lodash.get)(dashboard, 'attributes.panelsJSON', '[]'));
    } catch (err) {
      panels = [];
    }

    if (panels.length === 0) return [].concat([dashboard]);

    const docs = yield savedObjectsClient.bulkGet(panels);

    var _ref2 = yield Promise.all([(0, _collect_index_patterns.collectIndexPatterns)(savedObjectsClient, docs), (0, _collect_search_sources.collectSearchSources)(savedObjectsClient, docs)]),
        _ref3 = _slicedToArray(_ref2, 2);

    const indexPatterns = _ref3[0],
          searchSources = _ref3[1];

    return docs.concat(indexPatterns).concat(searchSources).concat([dashboard]);
  });

  return function collectPanels(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var _lodash = require('lodash');

var _collect_index_patterns = require('./collect_index_patterns');

var _collect_search_sources = require('./collect_search_sources');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
