(function(angular) {
    "use strict";

    /** ngInject */
    function objMngrService($q, afEntity) {
        var vm = this;
        vm.create = create;
        vm.bindTo = bindTo;
        vm.build = buildObject;
        vm.destroy = destroy;
        vm.id = id;
        vm.load = load;
        vm.ref = ref;
        vm.remove = remove;
        vm.save = save;
        vm.priority = priority;
        vm.value = value;
        vm.updateRecord = updateRecord;

        return vm;

        /* constructor for path objects
         * @param {Array of strings(or objs that respond to toString()}
         * all 'path' args below are for this param
         * @return Promise($firebaseObject)
         */
        function buildObject(path) {
            //* TODO: allow ojects as well
            return $q.when(afEntity.set("object", path))
                .catch(standardError);
        }

        /* following functions are a simple wrapper around
         * $firebaseObject api
         */

        /* @param {path}
         * @param {object}..js object of data
				 * @return {string}..reference where object is stored
         */


        function create(path, data) {
            return vm.build(path)
                .then(buildSuccess)
                .then(setSuccess)
                .catch(standardError);

            function buildSuccess(res) {
                return vm.ref(res)
                    .set(data);
            }
//untested 
						function setSuccess(res){
							return vm.ref(res);
						}
        }

        function bindTo(path, s, v) {
            return path.$bindTo(s, v);
        }

        // function priority(path, val) {
        //         return path.$priority;
        //     } else {
        //         return path.$priority = val;
        //     }
        // }

        // function value(path, val) {
        //     if (angular.isUndefined(val)) {
        //         return path.$value;
        //     } else {
        //         return path.$value = val;
        //     }
        // }



        /* @param{$firebaseObject}
         * @return{string}...key of object
         */
        function id(fb) {
            returnfb.$id;
        }

        /* @param{$firebaseObject}
         * @return{string}...ref of object
         */

        function ref(fb) {
            returnfb.$ref();
        }

        function load(path, result) {
        }

        function save(path, result) {
        }

        function remove(path, result) {

        }

        function updateRecord(rec, data) {
            return $q.when(forProperties(rec, data))
                .then(function(response) {
                    return vm.save(response);
                })
                .catch(standardError);
        }

        function updateItem(rec, prop, val) {
            rec[prop] = val;
        }


        function forProperties(rec, obj) {
            var key, str;
            for (key in obj) {
                str = key.toString();
                updateItem(rec, str, obj[str]);
            }
            return rec;

        }

        function destroy(path) {
            return path.$destroy();
        }


        /* Helper functions
         */
        function standardError(err) {
            return $q.reject(err);
        }

    }

    angular.module("fb.srvc.dataMngr")
        .service("objMngr", objMngrService);



})(angular);
