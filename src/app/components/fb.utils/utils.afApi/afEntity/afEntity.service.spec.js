(function() {
    "use strict";
    describe('afUtils Service', function() {
        var afEntity, $firebaseObject, $firebaseArray, $firebaseAuth, $timeout, obj;
        var DEFAULT_ID = 'ID1';
        var TEST_DATA = {
            aString: 'a string',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'another one'
            }
        };

        beforeEach(function() {
            MockFirebase.override();
            // module('mock.firebase');
            module('utils.afApi');
        });
        beforeEach(inject(function(_afEntity_, _$firebaseObject_, _$firebaseArray_, _$firebaseAuth_, _$timeout_) {
            $firebaseAuth = _$firebaseAuth_;
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            afEntity = _afEntity_;
            $timeout = _$timeout_;
            obj = makeObject(TEST_DATA);
        }));
        it("setRef = 'obj'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseObject(ref);
            expect(afEntity.setRef("users").prototype === testInst.prototype).toBeTruthy();
        });
        it("setRef = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
            expect(afEntity.setRef(["users", "phones", "1"]).prototype === testInst.prototype).toBeTruthy();
        });
        it("setRef() = firebase parentRef", function() {
            var testPath = "https://your-firebase.firebaseio.com";
            expect(afEntity.setRef().path).toEqual(testPath);
        });
        it("set = 'auth'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseAuth(ref);
            expect(afEntity.set("auth").prototype === testInst.prototype).toBeTruthy();
        });
        it("set = 'object'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseObject(ref);
            expect(afEntity.set("object", "users").prototype === testInst.prototype).toBeTruthy();
        });
        it("set = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
            expect(afEntity.set("array", ["users", "phones", "1"]).prototype === testInst.prototype).toBeTruthy();
        });

        // can't get the matcher to work
        // it("set with undefined type", function() {
        // 	expect(test).toThrowError('type must equal "object", "auth", or "array"');
        // 	var test = afEntity.set("objasdlect");
        // });
        // it("set with undefined entity", function() {
        // 	expect(afEntity.set("objasdlect")).toThrowError('you must call setRef first!');
        // });
        //
        // DRY up the following three macros - test_object_methods need to pass in "object,"array",etc
        describe("accessible $firebaseObject methods", function() {
            //cant test $value via this macro
            var entity, val, meth;
            var methodsForObj = [
                ['$id', 'string'],
                ['$priority', 'object'],
                ['$ref', 'function'],
                ['$save', 'function'],
                ['$loaded', 'function'],
                ['$destroy', 'function'],
                ['$bindTo', 'function'],
                ['$watch', 'function'],
                ['$loaded', 'function'],
                ['$remove', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = afEntity.set("object", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methodsForObj.forEach(test_entity_methods);
        });
        describe("accessible $firebaseArray methods", function() {
            var entity, val, meth;
            var methods = [
                ['$add', 'function'],
                ['$remove', 'function'],
                ['$save', 'function'],
                ['$getRecord', 'function'],
                ['$keyAt', 'function'],
                ['$indexFor', 'function'],
                ['$loaded', 'function'],
                ['$ref', 'function'],
                ['$watch', 'function'],
                ['$destroy', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = afEntity.set("array", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
        describe("accessible $firebaseAuth methods", function() {
            // can't test $unAuth via this macro
            var entity, val, meth;
            var methods = [
                ['$authWithCustomToken', 'function'],
                ['$authAnonymously', 'function'],
                ['$authWithPassword', 'function'],
                ['$authWithOAuthPopup', 'function'],
                ['$authWithOAuthRedirect', 'function'],
                ['$getAuth', 'function'],
                ['$onAuth', 'function'],
                ['$waitForAuth', 'function'],
                ['$requireAuth', 'function'],
                ['$createUser', 'function'],
                ['$changePassword', 'function'],
                ['$changeEmail', 'function'],
                ['$removeUser', 'function'],
                ['$resetPassword', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = afEntity.set("auth");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
        describe('$firebaseObject methods', function() {
            describe('$id', function() {
                it('should set the record id', function() {
                    expect(obj.$id).toEqual(obj.$ref().key());
                });
            });
            describe('$save', function() {
                it('should call $firebase.$set', function() {
                    spyOn(obj.$ref(), 'set');
                    obj.foo = 'bar';
                    obj.$save();
                    expect(obj.$ref().set).toHaveBeenCalled();
                });
                it('should return a promise', function() {
                    expect(obj.$save()).toBeAPromise();
                });
            });

        });
        //helpers from firebase/angularfire specs
        function stubRef() {
            return new MockFirebase('Mock:://').child('data').child(DEFAULT_ID);
        }

        function makeObject(data, ref) {
            if (!ref) {
                ref = stubRef();
            }
						//changed so testing afEntity
            var obj = afEntity.set("object", ref);
            if (angular.isDefined(data)) {
                ref.ref().set(data);
                ref.flush();
                $timeout.flush();
            }
            return obj;
        }

    });
})(angular);
