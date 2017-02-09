/*
 * Copyright (c) 2017. Taimos GmbH http://www.taimos.de
 */

const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
const flatten = require('gulp-flatten');
const mainBowerFiles = require('main-bower-files');

const conf = require('../conf/gulp.conf');

gulp.task('clean', clean);
gulp.task('other', other);
gulp.task('fonts', fonts);

function fonts() {
  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe(flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
}

function clean() {
  return del([conf.paths.dist, conf.paths.tmp], {force: true});
}

function other() {
  const fileFilter = filter(file => file.stat.isFile()
)
  ;
  
  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{scss,js,html}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}
