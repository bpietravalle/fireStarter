(function(angular) {
    "use strict";

    describe("Auth Service", function() {
        var auth, mock, ref, session, mockAuth, result, failure, status, $timeout;

        beforeEach(function() {
            MockFirebase.override();
            module("srvc.auth");
            module("fbMocks");
            inject(function(_$timeout_, _auth_, _session_, _mockAuth_) {
                $timeout = _$timeout_;
                auth = _auth_;
                session = _session_; //mock this
                mockAuth = _mockAuth_;
                ref = mockAuth.ref();
                mock = mockAuth.makeAuth(ref);
            });
            result = undefined;
            failure = undefined;
            status = null;
        });

        describe("passwordAndEmailLogin", function() {
            it('passes options and credentials object to underlying method', function() {
							var options = {};
                // var options = {
                //     someOption: 'a'
                // };
                var credentials = {
                    email: 'myname',
                    password: 'password'
                };
                auth.passwordAndEmailLogin(credentials, options);
                // mock.$authWithPassword(credentials, options);
                expect(mock.authWithPassword).toHaveBeenCalledWith({
                        email: 'myname',
                        password: 'password'
                    },
                    jasmine.any(Function), {
                        someOption: 'a'
                    }
                );
            });

            it('will revoke the promise if authentication fails', function() {
                wrapPromise(mock.$authWithPassword());
                callback('authWithPassword')('myError');
                $timeout.flush();
                expect(failure).toEqual('myError');
            });

            it('will resolve the promise upon authentication', function() {
                wrapPromise(mock.$authWithPassword());
                callback('authWithPassword')(null, 'myResult');
                $timeout.flush();
                expect(result).toEqual('myResult');
            });

        });








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



        //helper methods from fb/angularfire specs
        function wrapPromise(promise) {
            promise.then(function(_result_) {
                status = 'resolved';
                result = _result_;
            }, function(_failure_) {
                status = 'rejected';
                failure = _failure_;
            });
        }

        function callback(callbackName, callIndex) {
            callIndex = callIndex || 0; //assume the first call.
            var argIndex = getArgIndex(callbackName);
            return ref[callbackName].calls.argsFor(callIndex)[argIndex];
        }

        function getArgIndex(callbackName) {
            //In the firebase API, the completion callback is the second argument for all but a few functions.
            switch (callbackName) {
                case 'authAnonymously':
                case 'onAuth':
                    return 0;
                case 'authWithOAuthToken':
                    return 2;
                default:
                    return 1;
            }
        }

    });
}(angular));
