(function(angular) {
    'use strict';

    angular
        .module('fireStarter')
        .config(config);

    /** @ngInject */
    function config($logProvider) {
        $logProvider.debugEnabled(true);

    }

})(angular);
