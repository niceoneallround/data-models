//
// Assume that grunt-cli has been installed at the npm -g level, so can run grunt
//

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buddyjs: {
      src: ['lib/*.js', 'test/*.js'],
      options: {
        ignore: [0, 1, 2]
      }
    },

    jshint: {
      all: ['Gruntfile.js',
        'lib/*.js', 'test/*.js'],
      options: {
        predef: ['describe', 'it', 'before', 'after'],
        exported: ['should'],
        curly: true,
        indent: 2,
        node: true,
        undef: true,
        unused: true,
        eqeqeq: true,
        strict: true
      }
    },

    jscs: {
      src: ['lib/*.js', 'lib', 'test/*.js'],
      options: {
        preset: 'airbnb',
        disallowMultipleVarDecl: false,
        requireTrailingComma: false,
      },
      fix: {
        src: ['lib/*.js', 'lib', 'test/*.js'],
        options:{
          preset: 'airbnb',
          disallowMultipleVarDecl: false,
          requireTrailingComma: false,
          fix: true
        }
      }
    },

    mochaTest: {
      unitTest: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-buddyjs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('pp', ['jshint', 'jscs', 'buddyjs']);
  grunt.registerTask('test', ['pp', 'mochaTest:unitTest']);

  grunt.registerTask('buildTestCode', ['pp', 'mochaTest:unitTest']);
  grunt.registerTask('release', ['buildTestCode']);

  grunt.registerTask('default', ['buildTestCode']);

};
