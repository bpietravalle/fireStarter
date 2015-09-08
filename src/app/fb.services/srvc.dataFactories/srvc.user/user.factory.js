(function(angular) {
    "use strict";

    function userFactory(afEntity, objMngr) {

        var utils = {

            findById: findById,
            loadById: loadById,
						bindById: bindById,
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

				function bindById(id, s, v){
					return objMngr
					.bindTo(findById(id), s, v);
				}
    }


    userFactory.$inject = ['afEntity', 'objMngr'];

    angular.module("fb.srvc.dataFactories")
        .factory("user", userFactory);
})(angular);
