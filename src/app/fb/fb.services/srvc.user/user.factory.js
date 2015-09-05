(function(angular) {
    "use strict";

    function userFactory(afEntity, objMngr) {

        var utils = {

            findById: findById,
            loadById: loadById

        }

        return utils;

        function findById(id) {
            return afEntity
                .set("object", ["users", id])
        }

        function loadById(id) {
            return objMngr
                .load(findById(id));
        }

    }


    userFactory.$inject = ['afEntity', 'objMngr'];

    angular.module("srvc.auth")
        .factory("user", userFactory);
})(angular);
