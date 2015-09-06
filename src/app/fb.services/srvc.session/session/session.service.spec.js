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
        afterEach(function() {
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
        describe("google access token", function() {
            beforeEach(function() {
                this.twitter = {
                    provider: 'twitter',
                    google: {
                        accessToken: "TWITTER_STRING"
                    }
                };
                this.google= {
                    provider: 'google',
                    google: {
                        accessToken: "STRING"
                    }
                };
            });
            it("returns the correct value for google", function() {
                session.setAuthData(this.google);
                expect(session.getAccessToken()).toEqual("STRING");
						});

            it("returns the correct value for twitter", function() {
                session.setAuthData(this.twitter);
                expect(session.getAccessToken()).toEqual("TWITTER_STRING");
            });
            it("returns null if no provider object is available", function() {
                session.setAuthData("different");
                expect(session.getAccessToken()).toEqual(null);
            });

        });
    });
}(angular));
