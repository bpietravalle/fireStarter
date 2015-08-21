(function(angular) {
    "use strict";

    describe("Auth Service", function() {
        beforeEach(function() {
            MockFirebase.override();
            module("srvc.auth");
        });
        var auth, session, afEntity;

        beforeEach(inject(function(_auth_, _session_, _afEntity_) {
            auth = _auth_;
            session = _session_;
						afEntity = _afEntity_;
        }));

        it("should exist", function() {
            expect(auth).toBeDefined();
        });
        it("auth.loginOAuth is a function", function() {
            expect(typeof auth.loginOAuth).toBe('function');
        });
        it("auth.logOut is a function", function() {
            expect(typeof auth.logOut).toBe('function');
        });
        it("auth.isLoggedIn is a function", function() {
            expect(typeof auth.isLoggedIn).toBe('function');
        });
        // it("auth.googleLogin is a function", function() {
        //     expect(typeof auth.googleLogin).toBe('function');
        // });
        // it("auth.facebookLogin is a function", function() {
        //     expect(typeof auth.facebookLogin).toBe('function');
        // });
        // it("auth.twitterLogin is a function", function() {
        //     expect(typeof auth.twitterLogin).toBe('function');
        // });
    });
}(angular));
