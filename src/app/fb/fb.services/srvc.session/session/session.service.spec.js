(function() {
    "use strict";

    describe("Session Service", function() {
        var session, $log, localStorageService;
        beforeEach(function() {
            module("srvc.session");
        });

        beforeEach(inject(function(_session_, _$log_, _localStorageService_) {
            session = _session_;
            $log = _$log_;
            localStorageService = _localStorageService_;
        }));
				afterEach(function(){
					session = null;
					$log = null;
					localStorageService = null;
				});

        it("should exist", function() {
            expect(session).toBeDefined();
        });
        it("setAuthData returns correct string", function() {
            session.setAuthData("stuff");
            expect(session._authData).toEqual("stuff");
				});
        it("getAuthData returns correct string", function() {
            session.setAuthData("stuff");
            expect(session.getAuthData()).toEqual("stuff");
				});
        it("destroy resets authData", function() { 
            session.setAuthData("stuff");
            expect(session._authData).toEqual("stuff");
						session.destroy();
            expect(session._authData).toEqual(null);
        });
				//TODO: tests for OAuth access tokens
    });
}(angular));
