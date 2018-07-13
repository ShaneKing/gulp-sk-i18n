# [ShaneKing I18N for Gulp][]
More to see [shaneking.org][].

## Installation
Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-sk-i18n`

## Usage
```js
var gulp = require('gulp'),
  skI18n = require('./index');

gulp.task('default', function () {
  return gulp.src(['test/json/codes_en_US.json','test/json/codesAddress_en_US.json','test/json/i18n_en_US.json'])
    .pipe(skI18n({folderMapping:{codesAddress:'codes'}}))
    .pipe(gulp.dest('test/json/'))
});
```

## Dependencies
[![][david img]][david]
[![][davidDev img]][davidDev]
[![][davidPeer img]][davidPeer]

## Build
[![][travis img]][travis]

## Test
[![][codecov img]][codecov]

## Release
[![][npmbadge img]][npmbadge]
[![][npmDownloadbadge img]][npmDownloadbadge]

[![][npmDetailBadge img]][npmDetailBadge]

## Discussion
[![][gitter img]][gitter]

## License
[![][license img]][license]

ShaneKing is released under [Apache-2.0][].


[ShaneKing I18N for Gulp]: http://shaneking.org/c/gulp-sk-i18n
[shaneking.org]: http://shaneking.org/

[david]:https://david-dm.org/ShaneKing/gulp-sk-i18n
[david img]:https://david-dm.org/ShaneKing/gulp-sk-i18n.svg
[davidDev]:https://david-dm.org/ShaneKing/gulp-sk-i18n#info=devDependencies
[davidDev img]:https://david-dm.org/ShaneKing/gulp-sk-i18n/dev-status.svg
[davidPeer]:https://david-dm.org/ShaneKing/gulp-sk-i18n#info=peerDependencies
[davidPeer img]:https://david-dm.org/ShaneKing/gulp-sk-i18n/peer-status.svg

[travis]:https://travis-ci.org/ShaneKing/gulp-sk-i18n
[travis img]:https://travis-ci.org/ShaneKing/gulp-sk-i18n.png

[codecov]:https://codecov.io/github/ShaneKing/gulp-sk-i18n?branch=mirror
[codecov img]:https://codecov.io/github/ShaneKing/gulp-sk-i18n/coverage.svg?branch=mirror
[saucelabs]:https://saucelabs.com/u/ShaneKing
[saucelabs img]:https://saucelabs.com/browser-matrix/ShaneKing.svg

[npmbadge]:https://www.npmjs.com/package/gulp-sk-i18n
[npmbadge img]:https://img.shields.io/npm/v/gulp-sk-i18n.svg
[npmDownloadbadge]:https://www.npmjs.com/package/gulp-sk-i18n
[npmDownloadbadge img]:http://img.shields.io/npm/dm/gulp-sk-i18n.svg
[npmDetailBadge]:https://www.npmjs.com/package/gulp-sk-i18n
[npmDetailBadge img]:https://nodei.co/npm/gulp-sk-i18n.png?downloads=true&downloadRank=true&stars=true

[gitter]:https://gitter.im/ShaneKing/gulp-sk-i18n?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge
[gitter img]:https://badges.gitter.im/Join%20Chat.svg

[Apache-2.0]: https://opensource.org/licenses/Apache-2.0
[license]:LICENSE
[license img]:https://img.shields.io/badge/License-Apache--2.0-blue.svg
