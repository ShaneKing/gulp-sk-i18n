'use strict';

var Buffer = require('buffer').Buffer;
var crypto = require('crypto');
var gUtil = require('gulp-util');
var path = require('path');
var through = require('through2');
var File = gUtil.File;
var PluginError = gUtil.PluginError;

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function (opt) {
  opt = opt || {};
  if (!opt.hashAlgorithm) {
    opt.hashAlgorithm = 'md5';//'sha1'、'sha256'、'sha512'
  }
  if (!opt.hashLength) {
    opt.hashLength = 8;
  }

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

    // is not json
    if (file.extname != 'json') {
      this.emit('error', new PluginError('gulp-sk-i18n', 'just support json'));
      cb();
      return;
    }

    var hashObject = {};
    var jsonType = file.stem.split('_')[0];
    var suffixFilename = file.stem.split(jsonType)[1];

    var jsonObject = JSON.parse(file.contents.toString());
    var pathObjects = {};
    jsonNodeParser(jsonObject, '', pathObjects);
    Object.keys(pathObjects).forEach(function (pathStr) {
      var strContent = JSON.stringify(pathObjects[pathStr]);
      var hashValue = crypto.createHash(opt.hashAlgorithm).update(strContent).digest('hex').slice(0, opt.hashLength);
      hashObject[pathStr] = hashValue;
      files.push(new File({
        cwd: file.cwd,
        base: file.base,
        path: path.join(file.base, jsonType, pathStr, hashValue + suffixFilename),
        contents: new Buffer(strContent)
      }));
    });
    files.push(new File({
      cwd: file.cwd,
      base: file.base,
      path: path.join(file.base, jsonType + '_Hash' + suffixFilename),
      contents: new Buffer(JSON.stringify(hashObject))
    }));

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
