(function(angular) {
    "use strict";

    /** ngInject */
    function objMngrService(fbRef, $q, fbHandler) {
        var vm = this;
        vm.ref = ref;
        vm.load = load;
        vm.create = create;
        vm.save = save;
        vm.remove = remove;
        vm.destroy = destroy;
        vm.priority = priority;
        vm.id = id;
        vm.value = value;
        vm.updateRecord = updateRecord;
        vm.bindTo = bindTo;

        function priority(fb, val) {
            if (angular.isUndefined(val)) {
                return fb.$priority;
            } else {
                return fb.$priority = val;
            }
        }

        function value(fb, val) {
            if (angular.isUndefined(val)) {
                return fb.$value;
            } else {
                return fb.$value = val;
            }
        }

        //fb = fbref rather than $fbObject
        // current would be easier to test
        // $fbObject.$ref().set(), but this seems more direct
        function create(fb, data) {
            //TODO: return error if fb = $fbobject
            return fbHandler.handler(function(cb) {
                fb.set(data, cb);
            });
        }


        function id(fb) {
            return fb.$id;
        }

        function ref(fb) {
            return fb.$ref();
        }

        function load(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$loaded();
            } else {
                return fb.$loaded(result.success, result.failure);
            }
        }

        function save(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$save();
            } else {
                return fb.$save()
                    .then(result.success, result.failure);
            }
        }

        function remove(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$remove();
            } else {
                return fb.$remove()
                    .then(result.success, result.failure);
            }

        }

        function updateRecord(rec, data) {
            return $q.when(forProperties(rec, data))
                .then(function(response) {
                    return vm.save(response);
                })
                .catch(function(err) {
                    $q.reject(err)
                });
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

        function destroy(fb) {
            return fb.$destroy();
        }

        function bindTo(fb, s, v) {
            return fb.$bindTo(s, v);
        }
    }

    angular.module("fb.srvc.dataMngr")
        .service("objMngr", objMngrService);



})(angular);
