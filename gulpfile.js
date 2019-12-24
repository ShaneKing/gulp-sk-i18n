var gulp = require('gulp'),
  skI18n = require('./index');

gulp.task('default', function () {
  return gulp.src(['test/json/codes_en_US.json','test/json/codesAddress_en_US.json','test/json/i18n_en_US.json','test/json/i18n_zh_CN.json'])
    .pipe(skI18n({folderMapping:{codesAddress:'codes'}}))
    .pipe(gulp.dest('test/json/'))
});
