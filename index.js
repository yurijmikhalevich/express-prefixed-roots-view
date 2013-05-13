/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , dirname = path.dirname
  , basename = path.basename
  , extname = path.extname
  , exists = fs.existsSync || path.existsSync
  , join = path.join;

/**
 * Cross-platform function that checks, whether the path is absolute, copied from express/lib/utils
 * @param {String} path
 * @returns {boolean}
 * @api private
 */

var isAbsolute = function(path){
  if ('/' == path[0]) return true;
  if (':' == path[1] && '\\' == path[2]) return true;
};

/**
 * Expose `View`.
 */

module.exports = View;

/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` roots { prefix: dir } Object for view lookup
 *
 * @param {String} name
 * @param {Object} options
 * @api private
 */

function View(name, options) {
  options = options || {};
  this.name = name;
  this.roots = options.root;
  var engines = options.engines;
  this.defaultEngine = options.defaultEngine;
  var ext = this.ext = extname(name);
  if (!ext) name += (ext = this.ext = ('.' != this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
  this.path = this.lookup(name);
}

/**
 * Lookup view by the given `path`
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

View.prototype.lookup = function(path) {
  var root = this.roots[''];
  var lookedUp;
  if (root) {
    // if base root exists, check it first
    lookedUp = this.lookupOne(root, path);
    if (lookedUp) { return lookedUp; }
  }
  var slashIndex = path.indexOf('/');
  if (slashIndex == -1) { slashIndex = path.indexOf('\\'); }
  if (slashIndex > 0) {
    // if contains prefix
    var prefix = path.substring(0, slashIndex);
    root = this.roots[prefix];
    if (root) {
      // if prefixed root exists, check it
      lookedUp = this.lookupOne(root, path.substring(slashIndex + 1));
      if (lookedUp) { return lookedUp; }
    }
  }
};

/**
 * Lookup view by the given `path`
 *
 * @param {String} root
 * @param {String} path
 * @return {String}
 * @api private
 */

View.prototype.lookupOne = function(root, path) {
  var ext = this.ext;

  // <path>.<engine>
  if (!isAbsolute(path)) path = join(root, path);
  if (exists(path)) return path;

  // <path>/index.<engine>
  path = join(dirname(path), basename(path, ext), 'index' + ext);
  if (exists(path)) return path;
};

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function(options, fn) {
  this.engine(this.path, options, fn);
};