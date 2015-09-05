(function(angular) {
    "use strict";

    function userFactory(afEntity) {

        var utils = {





            findById: findById




        }

        return utils;



        function findById(id) {
            return afEntity
                .set("object", ["users", id])

        }



    }


    userFactory.$inject = ['afEntity'];

    angular.module("srvc.auth")
        .factory("user", userFactory);
})(angular);
