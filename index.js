'use strict';

require('sk-polyfill');

var Buffer = require('buffer').Buffer;
var crypto = require('crypto');
var gUtil = require('gulp-util');
var path = require('path');
var through = require('through2');

var File = gUtil.File;

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
  if (!opt.folderMapping) {
    opt.folderMapping = {};
  }

  var files = [];
  var folderLanguageHashObject = {};
  var folderLanguageHashFile = {};

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

    var currentPath = file.history[file.history.length - 1];
    var currentPaths = currentPath.split('/');
    var jsonFilename = currentPaths[currentPaths.length - 1];
    var folder = jsonFilename.split('_')[0];
    var languageFilename = jsonFilename.split(folder)[1];

    folder = opt.folderMapping[folder] ? opt.folderMapping[folder] : folder;

    if (!folderLanguageHashFile[folder + languageFilename]) {
      folderLanguageHashFile[folder + languageFilename] = new File({
        cwd: file.cwd,
        base: file.base,
        path: path.join(file.base, folder + '_Hash' + languageFilename)
      });
    }
    if (!folderLanguageHashObject[folder + languageFilename]) {
      folderLanguageHashObject[folder + languageFilename] = {};
    }
    var hashObject = folderLanguageHashObject[folder + languageFilename];

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
        path: path.join(file.base, folder, pathStr, hashValue + languageFilename),
        contents: new Buffer(strContent)
      }));
    });

    cb();
  }

  function endStream(cb) {

    files.forEach(function (file) {
      this.push(file);
    }.bind(this));

    Object.keys(folderLanguageHashFile).forEach(function (folderLanguage) {
      var file = folderLanguageHashFile[folderLanguage];
      file.contents = new Buffer(JSON.stringify(folderLanguageHashObject[folderLanguage]));
      this.push(file);
    }.bind(this));

    cb();
  }

  return through.obj(bufferContents, endStream);
};
