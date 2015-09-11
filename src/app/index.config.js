(function(angular) {
    'use strict';

    angular
        .module('fb')
        .config(config);

    /** @ngInject */
    function config($logProvider) {
        $logProvider.debugEnabled(true);

    }

})(angular);
