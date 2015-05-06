var gulp = require('gulp');
var less = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('css', function() {
  gulp.src('./app/styles/app.less')
    .pipe(less())
    .pipe(autoprefix('last 2 version'))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/css'))
    .pipe(notify('CSS compiled, prefixed, and minified.'));
});

gulp.task('vendorJs', function() {
  gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/knockout/dist/knockout.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify('Vendor JS concatenated.'));
});

gulp.task('js', function() {
  gulp.src([
      './app/map.js',
      './app/app.js'
    ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify('JS concatenated and minified.'));
});

gulp.task('watch', function() {
  gulp.watch('./app/styles/**/*.less', ['css']);
  gulp.watch('./app/**/*.js', ['js']);
});

gulp.task('default', ['css', 'vendorJs', 'js', 'watch']);
