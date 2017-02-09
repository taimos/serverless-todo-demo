const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('inject-full', gulp.series(gulp.parallel('styles', 'scripts'), 'environment', 'inject'));
gulp.task('build', gulp.series('partials', gulp.parallel('inject-full', 'fonts', 'other'), 'build'));
gulp.task('serve', gulp.series('clean', 'inject-full', 'watch', 'browsersync'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch([
    conf.path.src('index.html'),
    'bower.json'
  ], gulp.parallel('inject-full'));
  
  gulp.watch(conf.path.src('app/**/*.html'), reloadBrowserSync);
  gulp.watch([
    conf.path.src('**/*.scss'),
    conf.path.src('**/*.css')
  ], gulp.series('styles'));
  gulp.watch(conf.path.src('**/*.js'), gulp.series('scripts', 'inject'));
  done();
}
