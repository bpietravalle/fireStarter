(function(angular) {
    "use strict";

    /** @ngInject */

    function fireStarterMocks(baseBuilder, $q, $timeout, fireStarter,$firebaseArray,$firebaseObject) {
        var vm = this;

        vm.array = stubArray;
				vm.fbObject = fbObject;
				vm.fbArray = fbArray;
        vm.arrData = recArrayData;
        vm.auth = auth;
        vm.authRef = authRef;
        vm.object = makeObject;
        vm.makeGeo = makeGeo;
        vm.stubRef = stubRef;


        function makeObject(initialData, path, flag) {

            if (!path) {
                path = stubRef();
                flag = true;
            }
            var obj = fireStarter("object", path, flag);
            if (initialData) {
                obj.ref().set(initialData);
                obj.ref().flush();
                $timeout.flush();
            }
            return obj;
        }

				function fbObject(initialData, ref){
            if (!ref) {
                ref = stubRef();
            }
            var obj = $firebaseObject(ref);
            if (initialData) {
                obj.$ref().set(initialData);
                obj.$ref().flush();
                flushAll();
            }
            return obj;
				}

				function fbArray(initialData, ref){
            if (!ref) {
                ref = stubRef();
            }
            var arr = $firebaseArray(ref);
            if (initialData) {
                arr.$ref().set(initialData);
                arr.$ref().flush();
                flushAll();
            }
            return arr;
					
				
				}


        vm.fbArraySpy = jasmine.createSpyObj("fbArray", ["timestamp", "ref", "path", "add", "destroy",
            "getRecord", "keyAt", "indexFor", "loaded", "remove", "save", "watch"
        ]);
        vm.fbObjectSpy = jasmine.createSpyObj("fbObject", ["timestamp", "ref", "path", "bindTo", "destroy",
            "id", "priority", "value", "loaded", "remove", "save", "watch"
        ]);

        function stubRef(path) {
            if (!path) {
                return new MockFirebase('Mock://').child('data/REC1');
            } else {
                var mockPath = path.join('/');
            }
            return new MockFirebase('Mock://').child(mockPath);
        }


        function auth(ref) {
            if (!ref) {
                ref = authRef();
            }
            return fireStarter("auth", ref, true);
        }

        function authRef() {
            return jasmine.createSpyObj('ref', ['authWithCustomToken', 'authAnonymously', 'authWithPassword',
                'authWithOAuthPopup', 'authWithOAuthRedirect', 'authWithOAuthToken',
                'unauth', 'getAuth', 'onAuth', 'offAuth',
                'createUser', 'changePassword', 'changeEmail', 'removeUser', 'resetPassword'
            ]);
        }


        function stubArray(initialData, ref, flag) {
            if (!ref) {
                ref = stubRef();
                flag = true;
            }
            var arr = fireStarter("array", ref, flag);
            if (initialData) {
                arr.ref().set(initialData);
                arr.ref().flush();
                flushAll();
            }
            return arr;
        }

        function extendArray(initialData, Factory, ref) {
            if (!Factory) {
                Factory = $firebaseArray;
            }
            if (!ref) {
                ref = stubRef();
            }
            var factory = new Factory(ref);
            var arr = fireStarter("array", factory, true);
            if (initialData) {
                arr.ref().set(initialData);
                arr.ref().flush();
                flushAll();
            }
            return arr;
        };


        function recArrayData() {
            return {
                "1": {
                    number: "202-202-1111",
                    type: "cell"
                },
                "2": {
                    number: "603-202-5555",
                    type: "fax"
                }
            };
        }

        vm.geoQuerySpy = jasmine.createSpyObj("geoQuery", ["updateCriteria", "center", "remove", "radius", "on", "cancel"]);

        vm.geoSpyObj = {
            query: function() {
                return vm.geoQuerySpy;
            },
            get: function() {
                return jasmine.createSpy("get");
            },
            set: function() {
                return jasmine.createSpy("set");
            },
            remove: function() {
                return jasmine.createSpy("remove");
            },
            ref: function() {
                return stubRef();
            }
        };
        vm.geoSpy = $q.when(vm.geoSpyObj);

        vm.geoData = {
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
        vm.newGeoData = {
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

        function makeGeo(initialData, path, flag) {

            if (!path) {
                path = stubRef();
                flag = true;
            }

            var geo = fireStarter("geo", path, flag);

            if (initialData) {
                geo.ref().set(initialData);
                geo.ref().flush();
            }
            return geo;
        }

        var flushAll = (function() {
            return function flushAll() {
                // the order of these flush events is significant
                Array.prototype.slice.call(arguments, 0).forEach(function(o) {
                    o.flush();
                });
                try {
                    $timeout.flush();
                } catch (e) {}
            }
        })();
    }

    angular.module('fbMocks')
        .service('fsMocks', fireStarterMocks);

})(angular);
