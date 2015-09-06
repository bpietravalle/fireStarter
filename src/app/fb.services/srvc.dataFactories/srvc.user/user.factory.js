(function(angular) {
    "use strict";

    function userFactory(afEntity, objMngr) {

        var utils = {

            findById: findById,
            loadById: loadById,
            save: save
        };

        return utils;

        function findById(id) {
            return afEntity
                .set("object", ["users", id]);
        }

        function loadById(id) {
            return objMngr
                .load(findById(id));
        }

        function save(obj) {
            return objMngr.
            save(obj);
        }
    }


    userFactory.$inject = ['afEntity', 'objMngr'];

    angular.module("srvc.dataFactories")
        .factory("user", userFactory);
})(angular);
