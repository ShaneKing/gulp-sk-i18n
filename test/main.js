var skI18n = require('../index');

var gulp = require('gulp');
require('mocha');

describe('gulp-sk-i18n', function () {
  it('default', function () {
    gulp.src('json/*.json')
      .pipe(skI18n())
      .pipe(gulp.dest('json/'))
  })
});
