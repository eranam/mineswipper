// Generated on 2014-08-03 using generator-wix-angular 0.1.66
'use strict';

module.exports = function (grunt) {
  var unitTestFiles = [];
  require('./karma.conf.js')({set: function (karmaConf) {
    unitTestFiles = karmaConf.files.filter(function (value) {
      return value.indexOf('bower_component') !== -1;
    });
  }});
  require('wix-gruntfile')(grunt, {
    staging: 'pizza',
    cdnify: 'vm',
    port: 9000,
    preloadModule: 'mineswipperAppInternal',
    translationsModule: 'mineswipperTranslations',
    unitTestFiles: unitTestFiles,
    protractor: true
  });
  var yeoman = grunt.config('yeoman');
  yeoman.api = 'http://localhost:3000/';
  grunt.config('yeoman', yeoman);
};
