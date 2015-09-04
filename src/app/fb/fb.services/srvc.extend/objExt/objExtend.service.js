(function(angular) {
    "use strict";

    function objExtenderService(afEntity) {
        var path;

        function fbObj(path) {
            return afEntity.set("object", path);
        }

        objExtenderService.$inject = ["afEntity"];

        angular.module("srvc.extend")
            .service("objExtend", objExtenderService);


    }
})(angular);
