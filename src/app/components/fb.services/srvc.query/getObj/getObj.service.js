(function(angular) {
    "use strict";

    function getObjectService() {
        // var path;

        this.load = function(path) {
					return path.$loaded();
        };

        function fbObj(path) {
            return afEntity.set("object", path);
        }
    }

    getObjectService.$inject = [];

    angular.module("srvc.query")
        .service("getObj", getObjectService);



})(angular);
