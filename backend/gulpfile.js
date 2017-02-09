var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  jsFiles = [
    'index.js',
    'data/**/*.js',
    'api/**/*.js',
    'test/**/*.js'
  ];

function linting() {
  'use strict';
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}
gulp.task('linting', linting);

gulp.task('default', gulp.series('linting'));