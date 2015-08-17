(function() {
    "use strict";

    describe("Auth Service", function() {
        var auth;
        beforeEach(function() {
            module("fb");
            module("firebase");
        });


        beforeEach(inject(function(_auth_) {
            auth =_auth_;
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
        it("auth.googleLogin is a function", function() {
            expect(typeof auth.googleLogin).toBe('function');
        });
        it("auth.facebookLogin is a function", function() {
            expect(typeof auth.facebookLogin).toBe('function');
        });
        it("auth.twitterLogin is a function", function() {
            expect(typeof auth.twitterLogin).toBe('function');
        });
    });
}());
