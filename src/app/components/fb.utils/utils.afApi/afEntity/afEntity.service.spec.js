(function() {
    "use strict";
    describe('afUtils Service', function() {
        var afEntity;
        var fbEntity;
        var $firebaseAuth;
        var $firebaseArray;
        var $firebaseObject;

        beforeEach(function() {
            MockFirebase.override();
            module('utils.afApi');
        });
        beforeEach(inject(function(_afEntity_, _$firebaseObject_, _$firebaseArray_, _$firebaseAuth_, _fbEntity_) {
            $firebaseAuth = _$firebaseAuth_;
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            afEntity = _afEntity_;
            fbEntity = _fbEntity_;
        }));
        it("setRef = 'obj'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseObject(ref);
            expect(afEntity.setRef("users").prototype === testInst.prototype).toBeTruthy();
        });
        it("setRef = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
            expect(afEntity.setRef("users", "phones", "1").prototype === testInst.prototype).toBeTruthy();
        });
        it("setRef(null) = firebase parentRef", function() {
            var testPath = "https://your-firebase.firebaseio.com";
            expect(afEntity.setRef(null).path).toEqual(testPath);
        });
        it("set = 'auth'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseAuth(ref);
            expect(afEntity.set("auth").prototype === testInst.prototype).toBeTruthy();
        });
        it("set(auth).path = firebase parentRef", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseAuth(ref);
            expect(afEntity.set("auth").path).toEqual(testInst.path);
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

        describe("accessible $firebaseObject methods", function() {
					//cant test $value via this macro
            var obj, val, meth;
            var methods = [
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

            function test_object_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    obj = afEntity.set("object", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof obj[meth]).toEqual(val);
                });
            }
            methods.forEach(test_object_methods);
        });
        describe("accessible $firebaseArray methods", function() {
            var obj, val, meth;
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

            function test_object_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    obj = afEntity.set("array", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof obj[meth]).toEqual(val);
                });
            }
            methods.forEach(test_object_methods);
        });
        describe("accessible $firebaseAuth methods", function() {
					// can't test $unAuth via this macro
            var obj, val, meth;
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

            function test_object_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    obj = afEntity.set("auth");
                    val = y[1];
                    meth = y[0];
                    expect(typeof obj[meth]).toEqual(val);
                });
            }
            methods.forEach(test_object_methods);
        });
        // can't get the matcher to work
        // it("set with undefined type", function() {
        // 	expect(test).toThrowError('type must equal "object", "auth", or "array"');
        // 	var test = afEntity.set("objasdlect");
        // });
        // it("set with undefined entity", function() {
        // 	expect(afEntity.set("objasdlect")).toThrowError('you must call setRef first!');
        // });
    });
})(angular);
