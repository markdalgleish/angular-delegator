'use strict';

module.exports = function(grunt) {

  // Configurable paths
  var yoConfig = {
    src: 'src',
    dist: 'dist'
  };

  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    yo: yoConfig,
    meta: {
      banner: '/*!\n' +
        ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>\n' +
        ' * This content is released under the' +
        ' <%= _.pluck(pkg.licenses, "type").join(", ") %> license<%= pkg.licenses.length === 1 ? "" : "s" %>\n' +
        '' +
        ' */\n\n',
      microbanner: '/*! <%= pkg.title || pkg.name %> v<%= pkg.version %> ' +
        '© <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, ' +
        'Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yo.dist %>/*',
            '!<%= yo.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: [
          '{.tmp,<%= yo.src %>}/{,*/}*.js'
        ],
        tasks: ['test']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['test']
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['<%= yo.src %>/{,*/}*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: true
      },
      server: {
        autoWatch: true
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= yo.src %>/<%= pkg.name %>.js'],
        dest: '<%= yo.dist %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.microbanner %>'
      },
      dist: {
        src: '<%= yo.dist %>/<%= pkg.name %>.js',
        dest: '<%= yo.dist %>/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'test',
    'clean:dist',
    'concat:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('default', ['build']);

};
