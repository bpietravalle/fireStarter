(function(angular) {
    'use strict';

    angular
        .module('fb')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log) {

        $log.debug('runBlock end');
    }

})(angular);
