(function() {
    "use strict";

    describe("Session Service", function() {
        var session;
        beforeEach(function() {
            module("srvc.session");
        });

        beforeEach(inject(function(_session_) {
            session =_session_;
        }));

        it("should exist", function() {
            expect(session).toBeDefined();
        });
        it("#getAuthData is a function", function() {
            expect(typeof session.getAuthData).toBe('function');
        });
        it("#setAuthData is a function", function() {
            expect(typeof session.setAuthData).toBe('function');
        });
        it("#getGoogleAccessToken is a function", function() {
            expect(typeof session.getGoogleAccessToken).toBe('function');
        });
        it("#destroy is a function", function() {
            expect(typeof session.destroy).toBe('function');
        });
    });
}(angular));

