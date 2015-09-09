(function(angular) {
    'use strict';

    angular
        .module('fb')
        .config(config)
				.config(configStorage);

    /** @ngInject */
    function config($logProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
    }

    function configStorage(localStorageServiceProvider) {

        localStorageServiceProvider
            .setPrefix('fb')
            .setNotify(true, true)

    }

})(angular);
