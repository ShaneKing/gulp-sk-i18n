'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Concat = require('concat-with-sourcemaps');

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function (opt) {
  opt = opt || {};

  var files = [];

  function jsonNodeParser(jsonObject, existPath, pathObjects) {
    let pathObject = {};
    Object.keys(jsonObject).forEach(path => {
      if (path === '/') {
        let rootObject = jsonObject[path];
        Object.keys(rootObject).forEach(key => {
          pathObject[key] = rootObject[key];
        });
      } else if (path.skEndWith('/')) {
        pathObjects[existPath + (path.skStartWith('/') ? path : ('/' + path))] = jsonObject[path];
      } else if (path.skStartWith('/')) {
        jsonNodeParser(jsonObject[path], existPath + path, pathObjects);
      } else {
        pathObject[path] = jsonObject[path];
      }
    });
    // if (Object.keys(pathObject).length > 0) {
    //   pathObjects[existPath + '/'] = pathObject;
    // }
    //Always generate path
    pathObjects[existPath + '/'] = pathObject;
  }

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // we don't do streams (yet)
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-sk-i18n', 'Streaming not supported'));
      cb();
      return;
    }

    

    cb();
  }

  function endStream(cb) {

    files.forEach(function (file) {
      this.push(file);
    }.bind(this));

    cb();
  }

  return through.obj(bufferContents, endStream);
};
