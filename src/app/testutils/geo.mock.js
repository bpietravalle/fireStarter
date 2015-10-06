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


        vm.make = function(path, initialData) {
            var ref = vm.refWithPath(path);
            spyOn(fbRef, "ref").and.returnValue(ref);
            var obj = geoMngr(path);
            if (angular.isDefined(initialData)) {
                obj.ref().set(initialData);
                obj.ref().flush();
            } else {
                obj.ref().set(vm.initialData);
                obj.ref().flush();
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
