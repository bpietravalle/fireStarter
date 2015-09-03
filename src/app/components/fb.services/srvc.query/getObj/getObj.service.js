(function(angular) {
    "use strict";

    function getObjectService() {
        var fb;

        this.id = function(fb) {
            return fb.$id;
        };
        this.ref = function(fb) {
            return fb.$ref();
        };
        this.load = function(fb, opt, err) {
            if (opt !== null || err !== null) {
                return fb.$loaded(opt, err);
            } else {
                return fb.$loaded();
            }
        };
        this.save = function(fb, result) {
            if (result !== null) {
                //do this
            } else {
                return fb.$save();
            }
        };

    }

    getObjectService.$inject = [];

    angular.module("srvc.query")
        .service("getObj", getObjectService);



})(angular);
