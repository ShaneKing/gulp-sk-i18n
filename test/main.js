require('mocha');

var skI18n = require('../index');

var crypto = require('crypto');
var fs = require('fs');
var gulp = require('gulp');
var gUtil = require('gulp-util');
var should = require('should');
var I18N = require('sk-l10n').I18N;

var File = gUtil.File;

describe('gulp-sk-i18n', function () {

  describe('skI18n()', function () {
    describe('i18n', function () {

      var file, check, contentPathObjects = {};
      
      beforeEach(function () {
        file = new File({
          path: 'test/json/i18n_en_US.json',
          contents: fs.readFileSync('test/json/i18n_en_US.json')
        });

        var jsonObject = JSON.parse(file.contents.toString());
        var pathObjects = {};
        I18N.jsonNodeParser(jsonObject, '', pathObjects);
        Object.keys(pathObjects).forEach(function (validPath) {
          var strContent = JSON.stringify(pathObjects[validPath]);
          var hashValue = crypto.createHash('md5').update(strContent).digest('hex').slice(0, 8);
          contentPathObjects[strContent] = validPath + hashValue;
        });

        check = function (stream, done, cb) {
          stream.on('data', function (newFile) {
            cb(newFile);
          });

          stream.write(file);
          stream.end();

          done();
        };
      });

      it('equal', function (done) {
        var stream = skI18n();
        check(stream, done, function (newFile) {
          var strContent = String(newFile.contents);
          if (contentPathObjects[strContent]) {
            strContent.should.equal(fs.readFileSync('test/json/i18n' + contentPathObjects[strContent] + '_en_US.json', 'utf8'));
          }
        });
      });
    });
  });
});
