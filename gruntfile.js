'use strict';

module.exports = function(grunt) {
  // watch object
  var watchFiles = {
    js: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js']
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      options: {},
      dev: {
        NODE_ENV: 'development'
      }
    },
    watch: {
      js: {
        files: watchFiles.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.js,
        options: {
          node: true
        }
      }
    },

    // configure nodemon
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js',
          watch: watchFiles.js
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  // load NPM tasks
  require('load-grunt-tasks')(grunt);
  grunt.option('force', true);

  grunt.task.registerTask('loadConfig', 'Task that loads the config into grunt option.', function() {
    var init = require('./config/init')();
    var config = require('./config');
  });

  grunt.registerTask('default', ['env', 'jshint', 'concurrent:default']);
  grunt.registerTask('debug', ['env', 'jshint', 'concurrent:debug']);
};