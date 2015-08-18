(function(angular) {
    "use strict";
    describe('fbOBj Factory', function() {
        var fbObj;
        var fbutil;
        var $firebaseObject;

        beforeEach(function() {
            // MockFirebase.override();
            module('mock.firebase');
            module('fb.obj');
        });
        beforeEach(inject(function(_$firebaseObject_, _fbObj_, _fbutil_) {
            $firebaseObject = _$firebaseObject_;
            fbObj = _fbObj_;
            fbutil = _fbutil_;
        }));
        it("should return a $firebaseObject instance", function() {
            // var ref = new MockFirebase();
            // var testInst = $firebaseObject(ref);
            // expect(fbObj.ref('users')).toEqual("boom"); //.prototype === testInst.prototype).toBe(true);
        });
				// it("fbO = ", function() {
				// 	expect(fbObj.ref).toEqual("boom");
				// });
    });
})(angular);
