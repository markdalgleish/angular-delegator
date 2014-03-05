var gulp = require('gulp'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  karma = require('gulp-karma'),
  coveralls = require('gulp-coveralls'),
  header = require('gulp-header'),
  wrap = require('gulp-wrap'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  pkg = require('./package.json');

gulp.task('default', ['clean', 'jshint', 'karma', 'build']);

gulp.task('clean', function() {
  return gulp.src(['dist', 'test/coverage'], { read: false })
    .pipe(clean());
});

gulp.task('jshint', function() {
  return gulp.src(['gulpfile.js', 'src/**/*.js', 'specs/**/*.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('karma', ['clean'], function() {
  return gulp.src([
      'bower_components/angular/angular.js',
      'bower_components/jquery/jquery.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*',
      'test/spec/**/*Spec.js'])
    .pipe(karma({ configFile: 'karma.conf.js' }));
});

gulp.task('coveralls', ['karma'], function() {
  return gulp.src(['test/coverage/**/lcov.info'])
    .pipe(coveralls());
});

gulp.task('build', ['clean'], function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('angular-delegator.js'))
    .pipe(wrap('(function(){\n\n<%= contents %>\n}());'))
    .pipe(header([
        '/*!',
        ' * <%= title %> v<%= version %>',
        ' *',
        ' * Copyright <%= new Date().getFullYear() %>, <%= author.name %>',
        ' * This content is released under the <%= licenses[0].type %> license',
        ' * <%= licenses[0].url %>',
        ' */\n\n'
      ].join('\n'), pkg))
    .pipe(gulp.dest('dist'))
    .pipe(rename('angular-delegator.min.js'))
    .pipe(uglify())
    .pipe(header([
        '/*! <%= title %> v<%= version %> ',
        '© <%= new Date().getFullYear() %> <%= author.name %>, ',
        'Licensed <%= licenses[0].type %> */\n'
      ].join(''), pkg))
    .pipe(gulp.dest('dist'));
});
