/*!
 * resolve-path
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

//This package is used for creating errors (400, 403, etc)
var createError = require('http-errors')
//This is a specific function for normalising a string path - normalising extra '.' '..' and // path terms to create a path of /foo/bar/fizz/buzz/
var normalize = require('path').normalize
//This function resolves a sequence of steps (akin to unix dir commands) to produce an absolute path
var resolve = require('path').resolve
//This function allows the programme to work with both unix and dos / and \ path separators.
var sep = require('path').sep

/**
 * Module exports.
 */

module.exports = resolvePath

/**
 * Module variables.
 * @private
 */
//We don't quite get this one.
var upPathRegexp = /(?:^|[\\\/])\.\.(?:[\\\/]|$)/

/**
 * Resolve relative path against a root path
 *
 * @param {string} rootPath
 * @param {string} relativePath
 * @return {string}
 * @public
 */

function resolvePath(rootPath, relativePath) {
  //This creates local-scope vars to work with
  var path = relativePath
  var root = rootPath

  // root is optional, similar to root.resolve
  //Logic: if there is only one argument, then the argument is set as path, and the current process directory is set as the root path.
  if (arguments.length === 1) {
    path = rootPath
    root = process.cwd()
  }
  //These four tests ensure that the root/relative arguments are strings, and not null values
  if (root == null) {
    throw new TypeError('argument rootPath is required')
  }

  if (typeof root !== 'string') {
    throw new TypeError('argument rootPath must be a string')
  }

  if (path == null) {
    throw new TypeError('argument relativePath is required')
  }

  if (typeof path !== 'string') {
    throw new TypeError('argument relativePath must be a string')
  }

  // containing NULL bytes is malicious
  //This loops through the relative path searching for a NULL byte value, returning -1 if no NULL bytes are found. Throws error if any are found. 
  if (path.indexOf('\0') !== -1) {
    throw createError(400, 'Malicious Path')
  }

  // path should never be absolute
  //Logic: This compares the resolved relative path to the absolute path, if these are equal, then an absolute path has been passed as a relative path
  if (resolve(path) === path) {
    throw createError(400, 'Malicious Path')
  }

  // path outside root
  //This uses regular expressions to examine the normalised relative path. Bracket contents equal './path' The regex tests for the existence of '..' indicating a path above the root.
  if (upPathRegexp.test(normalize('.' + sep + path))) {
    throw createError(403)
  }

  // resolve & normalize the root path
  //This normalises the root path, appending a path separator
  root = normalize(resolve(root) + sep)

  // resolve the path
  // This appends the relative path to the root path, to produce a full path the object
  path = resolve(root, path)

  return path
}
