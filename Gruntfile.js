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
        src: ['app.js', 'lib/*.js']
      },
      routes: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['routes/*.js']
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
        src: ['package.json', '.jshintrc', 'config.json']
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

    webdriver: {
      test: {
        configFile: './wdio.conf.js'
      }
    },

    selenium_standalone: {
      options: {
        stopOnExit: true
      },
      server: {
        seleniumVersion: '2.53.0',
        seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
        drivers: {
          chrome: {
            version: '2.25',
            arch: process.arch,
            baseURL: 'http://chromedriver.storage.googleapis.com'
          }
        }
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
      }
    }
  });

  grunt.registerTask('lint', ['jshint', 'jsonlint', 'travis-lint']);

  grunt.registerTask('default', [
    'lint',
    'selenium_standalone:server:install',
    'selenium_standalone:server:start',
    'webdriver:test',
    'selenium_standalone:server:stop'
  ]);

};
