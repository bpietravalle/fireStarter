(function(angular) {
    "use strict";
    describe('Firebase Factory', function() {
        beforeEach(function() {
					MockFirebase.override();
            module('mock.firebase');
            module('fb.auth');
        });
        it("should return a $firebaseAuth instance", function() {
            inject(function(fbAuth, $firebaseAuth){ 
                var ref = new MockFirebase();
                var testInst = $firebaseAuth(ref);
                expect(fbAuth.prototype === testInst.prototype).toBe(true);
            });
        });
    });
})(angular);
