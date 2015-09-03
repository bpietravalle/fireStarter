(function(angular) {
    "use strict";

    function arrMngrService() {
        var fb, val, results;
        this.ref = function(fb) {
            return fb.$ref();
        };
        this.load = function(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$loaded();
            } else {
                return fb.$loaded(result.success, result.failure);
            }
        };
        this.save = function(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$save(val);
            } else {
                return fb.$save(val);
                    .then(result.success, result.failure);
            }
        };
        this.remove = function(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$remove(val);
            } else {
                return fb.$remove(val)
                    .then(result.success, result.failure);
            }

        };
        this.destroy = function(fb) {
            return fb.$destroy();
        };

    }

    arrMngrService.$inject = [];

    angular.module("srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
