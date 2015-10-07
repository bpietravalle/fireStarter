(function(angular) {
    "use strict";

    /** @ngInject */
    function geoObjMockService(geoMngr, fbRef, $timeout) {
        var DEFAULT_ID = 'REC1';
        var GFURL = "https://geofire.firebaseio.com";
        var vm = this;

        vm.initialData = {
            "a": {
                "g": "keyA",
                "1": {
                    "0": 90,
                    "1": 50
                }
            },
            "b": {
                "g": "keyB",
                "1": {
                    "0": 30,
                    "1": 60
                }
            },
            "c": {
                "g": "keyC",
                "1": {
                    "0": -70,
                    "1": 150
                }
            }
        };
        vm.newData = {
            "d": {
                "g": "keyD",
                "1": {
                    "0": 20,
                    "1": -180
                }
            },
            "e": {
                "g": "keyE",
                "1": {
                    "0": 40,
                    "1": -100
                }
            }
        };

        vm.stubRef = function() {
            return new MockFirebase('Mock://').child('data').child(DEFAULT_ID);
        };

        vm.refWithPath = function(path) {
            var mockPath = path.join('/');
            return new MockFirebase('Mock://').child(mockPath);
        };
        vm.refWithData = function(path) {
            var mockPath = path.join('/');
            var mock = new MockFirebase('Mock://').child(mockPath);
            mock.set(vm.initialData);
            mock.flush();
						return mock;
        };


        vm.make = function(path, initialData, r) {
            if (angular.isDefined(r)) {
                var ref = r;
            } else {
                var ref = vm.refWithPath(path);
            }
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
