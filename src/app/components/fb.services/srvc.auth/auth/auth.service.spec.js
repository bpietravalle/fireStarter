(function(angular) {
    "use strict";

    describe("Auth Service", function() {
        var auth, $q, mock, ref, session, deferred, $rootScope, authObj, mockAuth, result, failure, status, $timeout, afEntity;

        beforeEach(function() {
            // MockFirebase.override();
            module("srvc.auth");
            module("utils.afApi");
            module("fbMocks");
            inject(function(_$timeout_, _auth_, _$q_, _$rootScope_, _session_, _afEntity_, _mockAuth_) {
                $timeout = _$timeout_;
								$rootScope = _$rootScope_;
								$q = _$q_;
								deferred = $q.defer();
                auth = _auth_;
                session = _session_; //mock this
                afEntity = _afEntity_;
                authObj = afEntity.set();
                mockAuth = _mockAuth_;
                ref = mockAuth.ref();
                mock = mockAuth.makeAuth(ref);

            });
            result = undefined;
            failure = undefined;
            status = null;
        });

        describe("passwordAndEmailLogin", function() {
            it('returns a promise when passed valid credentials', function() {
                var options = {
                    someOption: 'a'
                };
                var credentials = {
                    email: 'myname',
                    password: 'password'
                };
                var test = auth.passwordAndEmailLogin(credentials, options);
								test.then(function(_result_){ result: _result_;});
								deferred.resolve("boom");
								$rootScope.$apply();
                expect(_result_).toEqual("boom")
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
            it('will set session data with authData obj if authentication is successful', function() {
                // var session = jasmine.createSpy('session');
                // var options = {
                //     someOption: 'a'
                // };
                // var credentials = {
                //     email: 'myname',
                //     password: 'password'
                // };
                // var test = auth.passwordAndEmailLogin(credentials, options);
                // expect(result).toEqual('myResult');


            });
        });

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
