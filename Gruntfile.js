//
// Assume that grunt-cli has been installed at the npm -g level, so can run grunt
//

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buddyjs: {
      src: ['lib/*.js'],
      options: {
        ignore: [0, 1, 2]
      }
    },

    jshint: {
      all: ['Gruntfile.js',
        'lib/*.js'],
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
      src: ['lib', 'lib/*.js'],
      options: {
        preset: 'airbnb'
      }
    }

  });

  grunt.loadNpmTasks('grunt-buddyjs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('pp', ['jshint', 'jscs', 'buddyjs']);

  grunt.registerTask('buildTestCode', ['pp']);
  grunt.registerTask('test', ['pp']);
  grunt.registerTask('release', ['pp']);

  grunt.registerTask('default', ['buildTestCode']);

};
