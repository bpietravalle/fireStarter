(function(angular) {
    'use strict';

    angular
        .module('fb', ['fb.auth', 'fb.session', 'fb.fbUtils', 'fb.afUtils',
            'restangular', 'ui.router'
        ]);

})(angular);
