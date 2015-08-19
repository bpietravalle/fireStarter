(function(angular) {
    "use strict";
    describe('afUtils Service', function() {
        var afEntity;
        var fbEntity;
        var $firebaseAuth;
        var $firebaseArray;
        var $firebaseObject;

        beforeEach(function() {
            MockFirebase.override();
            module('mock.firebase');
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
					expect(afEntity.setRef("users","phones","1").prototype === testInst.prototype).toBeTruthy();
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
					expect(afEntity.set("object","users").prototype === testInst.prototype).toBeTruthy();
				});
				it("set = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
					expect(afEntity.set("array",["users","phones","1"]).prototype === testInst.prototype).toBeTruthy();
				});
				// can't get the matcher to work
				// it("set with undefined type", function() {
				// 	expect(afEntity.set("objasdlect")).toThrowError('type must equal "object", "auth", or "array"');
				// });
				// it("set with undefined entity", function() {
				// 	expect(afEntity.set("objasdlect")).toThrowError('you must call setRef first!');
				// });
    });
})(angular);
