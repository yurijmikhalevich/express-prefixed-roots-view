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
 * @param {Object} path
 * @return {String}
 * @api private
 */

View.prototype.lookup = function(path) {
  var ext = this.ext;

  for (var prefix in this.roots) {
    if (!this.roots.hasOwnProperty(prefix)) { continue; }

    path = path.replace(new RegExp('^' + prefix), '');

    // <path>.<engine>
    if (!isAbsolute(path)) path = join(this.roots[prefix], path);
    if (exists(path)) return path;

    // <path>/index.<engine>
    path = join(dirname(path), basename(path, ext), 'index' + ext);
    if (exists(path)) return path;
  }
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