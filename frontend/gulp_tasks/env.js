/*
 * Copyright (c) 2017. Taimos GmbH http://www.taimos.de
 */

'use strict';

var gulp = require('gulp');
var conf = require('../conf/gulp.conf');

var inject = require('gulp-inject');

var minimist = require('minimist');
gulp.options = minimist(process.argv.slice(2));

var injectFormat = function (obj) {
  obj = JSON.stringify(obj, null, 4);
  // replace all doublequotes with singlequotes
  obj = obj.replace(/\"/g, '\'');
  // remove first and last line curly braces
  obj = obj.replace(/^\{\n/, '').replace(/\n\}$/, '');
  // remove first indentation
  obj = obj.replace(/^    /g, '');
  
  return obj;
};

gulp.task('environment', function () {
  var env = gulp.options.env || 'prod';
  return gulp.src('src/app/constants/config-const.js')
    .pipe(
      inject(
        gulp.src('src/app/constants/env-' + env + '.json'),
        {
          starttag: '/*inject-env*/',
          endtag: '/*endinject*/',
          transform: function (filePath, file) {
            var json;
            try {
              json = JSON.parse(file.contents.toString('utf8'));
            }
            catch (e) {
              console.log(e);
            }
            
            if (json) {
              json = injectFormat(json);
            }
            return json;
          }
        }))
    .pipe(gulp.dest('src/app/constants/'));
});
