(function(angular) {
    'use strict';

    angular
        .module('fb', ['fb.auth', 'firebase', 'LocalStorageModule', 'restangular', 'ui.router']);

})(angular);
