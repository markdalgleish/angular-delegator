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

var paths = {
  src: 'src/**/*.js',
  specs: 'test/spec/**/*Spec.js'
};

var filenames = {
  dev: 'angular-delegator.js',
  prod: 'angular-delegator.min.js'
};

gulp.task('default', ['jshint', 'karma', 'build']);

gulp.task('jshint', function() {
  return gulp.src(['gulpfile.js', paths.src, paths.specs.replace('test/', '')])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean-coverage', function() {
  return gulp.src(['test/coverage'], { read: false })
    .pipe(clean());
});

gulp.task('karma', ['clean-coverage'], function() {
  return gulp.src([
      'bower_components/angular/angular.js',
      'bower_components/jquery/jquery.js',
      'bower_components/angular-mocks/angular-mocks.js',
      paths.src,
      paths.specs])
    .pipe(karma({ configFile: 'karma.conf.js' }));
});

gulp.task('coveralls', ['karma'], function() {
  return gulp.src(['test/coverage/**/lcov.info'])
    .pipe(coveralls());
});

gulp.task('clean-build', function() {
  return gulp.src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('build', ['clean-build'], function() {
  return gulp.src(paths.src)
    .pipe(concat(filenames.dev))
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
    .pipe(rename(filenames.prod))
    .pipe(uglify())
    .pipe(header([
        '/*! <%= title %> v<%= version %> ',
        '© <%= new Date().getFullYear() %> <%= author.name %>, ',
        'Licensed <%= licenses[0].type %> */\n'
      ].join(''), pkg))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch([paths.src, paths.specs], ['karma']);
});
