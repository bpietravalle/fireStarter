(function(angular) {
    "use strict";

    /** @ngInject */
    function geoObjMockService(geoMngr, fbRef, $timeout) {
        var DEFAULT_ID = 'REC1';
        var vm = this;

        vm.initialData = {
            "g": "geoKey",
            "1": {
                "0": 90,
                "1": 100
            }
        };

        vm.stubRef = function() {
            return new MockFirebase('Mock://').child('data').child(DEFAULT_ID);
        };

        vm.refWithPath = function(path) {
            var mockPath = path.join('/');
            return new MockFirebase('Mock://').child(mockPath);
        };


        vm.make = function(name, path, initialData) {
            var ref = vm.refWithPath(path);
            spyOn(fbRef, "ref").and.returnValue(ref);
            var obj = new geoMngr.build(name, path);
            if (angular.isDefined(initialData)) {
                obj.instance();
                ref.ref().set(initialData);
                ref.flush();
            } else {
                obj.instance();
                ref.ref().set(vm.initialData);
                ref.flush();
            }

            return obj;
        };

        vm.flushRef = function(mock) {
            mock.ref().flush();
            return mock.ref();
        };
    }
    angular.module('fbMocks')
        .service('geoMock', geoObjMockService);

})(angular);
