(function(angular) {
    "use strict";

    function arrMngrService() {

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
                return fb.$save(val)
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
        this.key = function(fb, val) {
            return fb.$keyAt(val);
        };
        //untested
        this.get = function(fb, val) {
            return fb.$getRecord(val);
        };
        this.index = function(fb, val) {
            return fb.$indexFor(val);
        };

        this.add = function(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$add(val);
            } else {
                return fb.$add(val)
                    .then(result.success, result.failure);
            }
        };

    }

    arrMngrService.$inject = [];

    angular.module("srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
