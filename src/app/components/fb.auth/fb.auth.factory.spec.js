(function() {
    "use strict";
    describe('Firebase Factory', function() {
			var fbUtils;
        beforeEach(function() {
					MockFirebase.override();
            module('mock.firebase');
            module('fb.auth');
        });
        it("should return a $firebaseAuth instance", function() {
            inject(function(Fb, $firebaseAuth, _fbUtils_) {
                var ref = new MockFirebase();
                var testInst = $firebaseAuth(ref);
								var fbUtils = _fbUtils_;
                expect(Fb.prototype === testInst.prototype).toBe(true);
            });
        });
    });
})();
