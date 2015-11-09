'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
    var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            path.join(conf.paths.src, '/app/**/*.module.js'),
            path.join(conf.paths.src, '/app/**/*.js'),
            path.join(conf.paths.src, '/test/**/*.js'),
            path.join(conf.paths.src, '/testutils/*.js'),
            path.join(conf.paths.src, '/**/*.spec.js'),
            path.join(conf.paths.src, '/**/*.mock.js'),
            path.join(conf.paths.src, '/**/*.html')
        ]);
}

module.exports = function(config) {

    var configuration = {
        files: listFiles(),

        singleRun: true,

        autoWatch: true,
        autoWatchBatchDelay: 750,

        colors: true,

        frameworks: ['jasmine', 'jasmine-matchers', 'angular-filesort'],

        angularFilesort: {
            whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
        },

        // reporters: ['notify', 'progress'],
        reporters: ['coverage', 'spec', 'progress', 'notify', 'nested'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/',
            moduleName: 'FireStarter'
        },

        browsers: ['PhantomJS'],

        plugins: [
            'karma-phantomjs-launcher',
            'karma-angular-filesort',
            'karma-spec-reporter',
            'karma-coverage',
            // 'karma-verbose-reporter',
            'karma-nested-reporter',
            'karma-notify-reporter',
            'karma-jasmine-matchers',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ],
        specReporter: {
            maxLogLines: 5
        },

        preprocessors: {
            'src/**/*.html': ['ng-html2js']
        }
    };


    // This block is needed to execute Chrome on Travis
    // If you ever plan to use Chrome and Travis, you can keep it
    // If not, you can safely remove it
    // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
    if (configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
        configuration.customLaunchers = {
            'chrome-travis-ci': {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        };
        configuration.browsers = ['chrome-travis-ci'];
    }

    config.set(configuration);
};
