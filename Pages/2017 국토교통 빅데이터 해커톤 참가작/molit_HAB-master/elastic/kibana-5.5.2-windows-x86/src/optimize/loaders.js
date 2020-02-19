'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLoaderQueryParam = exports.makeLoaderString = undefined;

var _url = require('url');

class Loader {
  constructor({ name, query } = {}) {
    if (!name) {
      throw new Error('Loaders must define a name');
    }

    this.name = name;
    this.query = query || {};
  }

  static fromUrl(url) {
    const parsed = (0, _url.parse)(url, true);
    return new Loader({
      name: parsed.pathname,
      query: parsed.query
    });
  }

  toString() {
    return (0, _url.format)({
      pathname: this.name,
      query: this.query
    });
  }

  setQueryParam(name, value) {
    this.query[name] = value;
    return this;
  }
}

function parseLoader(spec) {
  if (typeof spec === 'string') {
    return Loader.fromUrl(spec);
  }

  return new Loader(spec);
}

const makeLoaderString = exports.makeLoaderString = loaders => {
  return loaders.map(parseLoader).map(l => l.toString()).join('!');
};

const setLoaderQueryParam = exports.setLoaderQueryParam = (loader, name, value) => {
  return parseLoader(loader).setQueryParam(name, value).toString();
};
