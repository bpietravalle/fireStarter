(function(angular) {
    "use strict";
    describe('Firebase Factory', function() {
			var fbutil;
        beforeEach(function() {
					MockFirebase.override();
            module('mock.firebase');
            module('fb.auth');
        });
        it("should return a $firebaseAuth instance", function() {
            inject(function(fbAuth, $firebaseAuth){ //, _fbutil_) {
                var ref = new MockFirebase();
                var testInst = $firebaseAuth(ref);
								// var fbutil = _fbutil_;
                expect(fbAuth.prototype === testInst.prototype).toBe(true);
            });
        });
    });
})(angular);
