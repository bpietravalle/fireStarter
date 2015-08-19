(function(angular) {
    "use strict";
    describe('fbOBj Factory', function() {
        var fbObj;
        var fbutil;
        var $firebaseAuth;
        var $firebaseArray;
        var $firebaseObject;

        beforeEach(function() {
            MockFirebase.override();
            module('mock.firebase');
            module('fb.obj');
        });
        beforeEach(inject(function(_fbObj_, _$firebaseObject_, _$firebaseArray_, _$firebaseAuth_, _fbutil_) {
            $firebaseAuth = _$firebaseAuth_;
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            fbObj = _fbObj_;
            fbutil = _fbutil_;
        }));
				it("setRef = 'obj'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseObject(ref);
					expect(fbObj.setRef("users").prototype === testInst.prototype).toBeTruthy();
				});
				it("setRef = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
					expect(fbObj.setRef("users","phones","1").prototype === testInst.prototype).toBeTruthy();
				});
				it("setRef(null) = firebase parentRef", function() {
            var testPath = "https://your-firebase.firebaseio.com";
					expect(fbObj.setRef(null).path).toEqual(testPath);
				});
				it("setEntity = 'auth'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseAuth(ref);
					expect(fbObj.setEntity("auth").prototype === testInst.prototype).toBeTruthy();
				});
				it("setEntity(auth).path = firebase parentRef", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseAuth(ref);
					expect(fbObj.setEntity("auth").path).toEqual(testInst.path);
				});
				it("setEntity = 'object'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseObject(ref);
					expect(fbObj.setEntity("object","users").prototype === testInst.prototype).toBeTruthy();
				});
				it("setEntity = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
					expect(fbObj.setEntity("array",["users","phones","1"]).prototype === testInst.prototype).toBeTruthy();
				});
				// can't get the matcher to work
				// it("setEntity with undefined type", function() {
				// 	expect(fbObj.setEntity("objasdlect")).toThrowError('type must equal "object", "auth", or "array"');
				// });
				// it("setEntity with undefined entity", function() {
				// 	expect(fbObj.setEntity("objasdlect")).toThrowError('you must call setRef first!');
				// });
    });
})(angular);
