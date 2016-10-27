'use strict';

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    datetime: Date.now(),

    sass: {
      dist: {
        files: {
          'public/css/main.css': 'public/css/main.scss'
        }
      }
    },

    /* Run JSHint on our JS files */
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      taskfiles: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['Gruntfile.js', 'wdio.conf.js']
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['app/**/*.js']
      },
      tests: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['test/*.js']
      }
    },

    /* Run JSONLint on our configuration files */
    jsonlint: {
      configFiles: {
        src: ['package.json', '.jshintrc']
      }
    },

    githooks: {
      all: {
        options: {
          preventExit: true
        },
        'pre-commit': 'lint'
      }
    },

    /* Watch tasks */
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint']
      },
      css: {
        files: ['css/*.scss', '!css/main.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.registerTask('lint', ['jshint', 'jsonlint', 'travis-lint']);
  grunt.registerTask('default', ['lint']);
};
