(function() {
    "use strict";
    describe('Firebase Factory', function() {
			var fbutil;
        beforeEach(function() {
					MockFirebase.override();
            module('mock.firebase');
            module('fb');
        });
        it("should return a $firebaseAuth instance", function() {
            inject(function(Fb, $firebaseAuth, _fbutil_) {
                var ref = new MockFirebase();
                var testInst = $firebaseAuth(ref);
								var fbutil = _fbutil_;
                expect(Fb.prototype === testInst.prototype).toBe(true);
            });
        });
    });
})();
