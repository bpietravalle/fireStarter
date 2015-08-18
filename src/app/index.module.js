(function(angular) {
    'use strict';

    angular
        .module('fb', ['fb.auth', 'fb.session', 'fb.utils',
            'restangular', 'ui.router'
        ]);

})(angular);
