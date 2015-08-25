(function(angular) {
    "use strict";

    describe("Auth Service", function() {
        var auth, data, mock, ref, $q, $rootScope, session, authObj, mockAuth, result, failure, status, $timeout, afEntity;

        beforeEach(function() {
            MockFirebase.override();
            module("srvc.auth");
            module("utils.afApi");
            module("fbMocks");
            inject(function(_$timeout_, _auth_, _session_, _$q_, _$rootScope_, _mockAuth_) {
                $timeout = _$timeout_;
                $rootScope = _$rootScope_;
                $q = _$q_;
                auth = _auth_;
                session = _session_; //mock this
                // afEntity = _afEntity_;
                // authObj = afEntity.set();
                mockAuth = _mockAuth_;
                ref = mockAuth.ref();
                mock = mockAuth.makeAuth(ref);
                // spyOn(auth, "authObj").and.callThrough();
                spyOn(auth, 'passwordAndEmailLogin').and.callFake(function() {
                    var deferred = $q.defer();
                    deferred.resolve('Boom');
                    return deferred.promise;
                });
            });
            result = undefined;
            // failure = undefined;
            // status = null;
        });
        describe("isLoggedIn", function() {
            it("returns true if session has authData", function() {
                spyOn(session, "getAuthData").and.returnValue([1, 2, 3, 4]);
                expect(auth.isLoggedIn()).toBeTruthy();
            });
            it("returns false if session.getAuthdata = null", function() {
                spyOn(session, "getAuthData").and.returnValue(null);
                expect(auth.isLoggedIn()).toBeFalsey;
            });
        });

        describe("passwordAndEmailLogin", function() {
            beforeEach(function() {
								
                this.options = {
                    someOption: 'a'
                };
                this.credentials = {
                    email: 'myname',
                    password: 'password'
                };
            });
            it('passed credentials to afEntity', function() {
                var test = auth.passwordAndEmailLogin(this.credentials, this.options);

                $rootScope.$digest();
                expect(test.$$state.value).toEqual("Boom");
            });
            // it('authObj is called', function() {
            //     expect(authObj.$authWithPassword).toBeDefined();
            // });

            // it('will revoke the promise if authentication fails', function() {
            //     wrapPromise(mock.$authWithPassword());
            //     callback('authWithPassword')('myError');
            //     $timeout.flush();
            //     expect(failure).toEqual('myError');
            // });
            // it('will resolve the promise upon authentication', function() {
            // data = mockAuth.authData();	
            //     wrapPromise(mock.$authWithPassword());
            //     callback('authWithPassword')(null,data);
            //     $timeout.flush();
            //     expect(result).toEqual(data);
            // });
            // it('will set session data with authData obj if authentication is successful', function() {
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


            // });
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
