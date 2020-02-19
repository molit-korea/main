'use strict';

var _path = require('path');

var _fs = require('fs');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _webpackDirectoryNameAsMain = require('@elastic/webpack-directory-name-as-main');

var _webpackDirectoryNameAsMain2 = _interopRequireDefault(_webpackDirectoryNameAsMain);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

var _CommonsChunkPlugin2 = _interopRequireDefault(_CommonsChunkPlugin);

var _DefinePlugin = require('webpack/lib/DefinePlugin');

var _DefinePlugin2 = _interopRequireDefault(_DefinePlugin);

var _UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

var _UglifyJsPlugin2 = _interopRequireDefault(_UglifyJsPlugin);

var _lodash = require('lodash');

var _utils = require('../utils');

var _options = require('./babel/options');

var _options2 = _interopRequireDefault(_options);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _loaders = require('./loaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const babelExclude = [/[\/\\](webpackShims|node_modules|bower_components)[\/\\]/];

class BaseOptimizer {
  constructor(opts) {
    this.env = opts.env;
    this.urlBasePath = opts.urlBasePath;
    this.bundles = opts.bundles;
    this.profile = opts.profile || false;

    switch (opts.sourceMaps) {
      case true:
        this.sourceMaps = 'source-map';
        break;

      case 'fast':
        this.sourceMaps = 'cheap-module-eval-source-map';
        break;

      default:
        this.sourceMaps = opts.sourceMaps || false;
        break;
    }

    this.unsafeCache = opts.unsafeCache || false;
    if (typeof this.unsafeCache === 'string') {
      this.unsafeCache = [new RegExp(this.unsafeCache.slice(1, -1))];
    }
  }

  initCompiler() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.compiler) return _this.compiler;

      const compilerConfig = _this.getConfig();
      _this.compiler = (0, _webpack2.default)(compilerConfig);

      _this.compiler.plugin('done', function (stats) {
        if (!_this.profile) return;

        const path = (0, _path.resolve)(_this.env.workingDir, 'stats.json');
        const content = JSON.stringify(stats.toJson());
        (0, _fs.writeFile)(path, content, function (err) {
          if (err) throw err;
        });
      });

      return _this.compiler;
    })();
  }

  getConfig() {
    const loaderWithSourceMaps = loader => (0, _loaders.setLoaderQueryParam)(loader, 'sourceMap', !!this.sourceMaps);

    const makeStyleLoader = preprocessor => {
      let loaders = [loaderWithSourceMaps('css-loader?autoprefixer=false'), {
        name: 'postcss-loader',
        query: {
          config: require.resolve('./postcss.config')
        }
      }];

      if (preprocessor) {
        loaders = [...loaders, loaderWithSourceMaps(preprocessor)];
      }

      return _extractTextWebpackPlugin2.default.extract((0, _loaders.makeLoaderString)(loaders));
    };

    const config = {
      node: { fs: 'empty' },
      context: (0, _utils.fromRoot)('.'),
      entry: this.bundles.toWebpackEntries(),

      devtool: this.sourceMaps,
      profile: this.profile || false,

      output: {
        path: this.env.workingDir,
        filename: '[name].bundle.js',
        sourceMapFilename: '[file].map',
        publicPath: `${this.urlBasePath || ''}/bundles/`,
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
      },

      recordsPath: (0, _path.resolve)(this.env.workingDir, 'webpack.records'),

      plugins: [new _webpack2.default.ResolverPlugin([new _webpackDirectoryNameAsMain2.default()]), new _webpack2.default.NoErrorsPlugin(), new _extractTextWebpackPlugin2.default('[name].style.css', {
        allChunks: true
      }), new _CommonsChunkPlugin2.default({
        name: 'commons',
        filename: 'commons.bundle.js'
      }), ...this.pluginsForEnv(this.env.context.env)],

      module: {
        loaders: [{ test: /\.less$/, loader: makeStyleLoader('less-loader') }, { test: /\.css$/, loader: makeStyleLoader() }, { test: /\.jade$/, loader: 'jade-loader' }, { test: /\.json$/, loader: 'json-loader' }, { test: /\.(html|tmpl)$/, loader: 'raw-loader' }, { test: /\.png$/, loader: 'url-loader' }, { test: /\.(woff|woff2|ttf|eot|svg|ico)(\?|$)/, loader: 'file-loader' }, { test: /[\/\\]src[\/\\](core_plugins|ui)[\/\\].+\.js$/, loader: loaderWithSourceMaps('rjs-repack-loader') }, {
          test: /\.jsx?$/,
          exclude: babelExclude.concat(this.env.noParse),
          loader: 'babel-loader',
          query: _options2.default.webpack
        }],
        postLoaders: this.env.postLoaders || [],
        noParse: this.env.noParse
      },

      resolve: {
        extensions: ['.js', '.json', '.jsx', '.less', ''],
        postfixes: [''],
        modulesDirectories: ['webpackShims', 'node_modules'],
        fallback: [(0, _utils.fromRoot)('webpackShims'), (0, _utils.fromRoot)('node_modules')],
        loaderPostfixes: ['-loader', ''],
        root: (0, _utils.fromRoot)('.'),
        alias: this.env.aliases,
        unsafeCache: this.unsafeCache
      },

      resolveLoader: {
        alias: (0, _lodash.transform)(_package2.default.dependencies, function (aliases, version, name) {
          if (name.endsWith('-loader')) {
            aliases[name] = require.resolve(name);
          }
        }, {})
      }
    };

    // In the test env we need to add react-addons (and a few other bits) for the
    // enzyme tests to work.
    // https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md
    if (this.env.context.env === 'development') {
      config.externals = {
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
        'react/lib/ReactContext': true
      };
    }

    return config;
  }

  pluginsForEnv(env) {
    if (env !== 'production') {
      return [];
    }

    return [new _DefinePlugin2.default({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }), new _UglifyJsPlugin2.default({
      compress: {
        warnings: false
      },
      sourceMap: false,
      mangle: false
    })];
  }

  failedStatsToError(stats) {
    const statFormatOpts = {
      hash: false, // add the hash of the compilation
      version: false, // add webpack version information
      timings: false, // add timing information
      assets: false, // add assets information
      chunks: false, // add chunk information
      chunkModules: false, // add built modules information to chunk information
      modules: false, // add built modules information
      cached: false, // add also information about cached (not built) modules
      reasons: false, // add information about the reasons why modules are included
      source: false, // add the source code of modules
      errorDetails: false, // add details to errors (like resolving log)
      chunkOrigins: false, // add the origins of chunks and chunk merging info
      modulesSort: false, // (string) sort the modules by that field
      chunksSort: false, // (string) sort the chunks by that field
      assetsSort: false, // (string) sort the assets by that field
      children: false
    };

    const details = stats.toString((0, _lodash.defaults)({ colors: true }, statFormatOpts));

    return _boom2.default.create(500, `Optimizations failure.\n${details.split('\n').join('\n    ')}\n`, stats.toJson(statFormatOpts));
  }
}

module.exports = BaseOptimizer;
