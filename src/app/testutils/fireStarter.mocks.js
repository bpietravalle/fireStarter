(function(angular) {
    "use strict";

    /** @ngInject */

    function fireStarterMocks(baseBuilder, $timeout, fireStarter) {
        var utils = {
            arrData: recArrayData,
						auth: auth,
            ref: stubRef,
            array: stubArray,
            object: makeObject

        }

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



        function stubRef() {
            return new MockFirebase('Mock://').child('data/REC1');
        }

				function auth(){
					return fireStarter("auth", authRef(), true);
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

    }

    angular.module('fbMocks')
        .factory('fireStarterMocks', fireStarterMocks);

})(angular);
