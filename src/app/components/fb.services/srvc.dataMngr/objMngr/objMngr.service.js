(function(angular) {
    "use strict";

    function objMngrService() {

        this.priority = function(fb, val) {
            if (angular.isUndefined(val)) {
                return fb.$priority;
            } else {
                return fb.$priority = val;
            }
        };
        this.value = function(fb, val) {
            if (angular.isUndefined(val)) {
                return fb.$value;
            } else {
                return fb.$value = val;
            }
        };

        this.id = function(fb) {
            return fb.$id;
        };
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
        this.save = function(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$save();
            } else {
                return fb.$save()
                    .then(result.success, result.failure);
            }
        };
        this.remove = function(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$remove();
            } else {
                return fb.$remove()
                .then(result.success, result.failure);
            }

        };
        this.destroy = function(fb) {
            return fb.$destroy();
        };

    }

    objMngrService.$inject = [];

    angular.module("srvc.dataMngr")
        .service("objMngr", objMngrService);



})(angular);
