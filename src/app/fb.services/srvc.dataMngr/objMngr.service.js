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
        function bindTo(path, s, v) {
            return vm.build(path)
                .then(buildForBind)
                .catch(standardError);

            function buildForBind(res) {
                return res.$bindTo(s, v);
            }
        }

        /* @param {path}
         * @param {object}..js object of data
         * @return {string}..reference where object is stored
         */

        function create(path, data) {
            return vm.build(path)
                .then(buildForCreate)
                .then(setSuccess)
                .catch(standardError);

            function buildForCreate(res) {
                    return vm.ref(res)
                        .set(data);
                }
                //untested 

            function setSuccess(res) {
                return vm.ref(res);
            }
        }


        function priority(path) {
            return vm.build(path)
                .then(buildForPriority)
                .catch(standardError);

            function buildForPriority(res) {
                return res.$priority;
            }

        }

        function value(path) {
            return vm.build(path)
                .then(buildForValue)
                .catch(standardError);

            function buildForValue(res) {
                return res.$value;
            }

        }

        function remove(path) {
            return vm.build(path)
                .then(buildForRemove)
                .catch(standardError);

            function buildForRemove(res) {
                return res.$remove();
            }

        }

        function load(path) {
            return vm.build(path)
                .then(buildForLoad)
                .catch(standardError);

            function buildForLoad(res) {
                return res.$load();
            }

        }

        function value(path) {
            return vm.build(path)
                .then(buildForValue)
                .catch(standardError);

            function buildForValue(res) {
                return res.$value;
            }

        }



        /* @param{$firebaseObject}
         * @return{string}...key of object
         */
        function id(fb) {
            return fb.$id;
        }

        /* @param{$firebaseObject}
         * @return{string}...ref of object
         */

        function ref(fb) {
            return fb.$ref();
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
