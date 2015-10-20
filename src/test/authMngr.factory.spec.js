(function() {
    "use strict";
    describe("Auth Manager", function() {
        var $log, $timeout, credentials, authTest, deferred, $q, auth, authMngr, afEntity, ref, $rootScope, mockAuth;

        beforeEach(function() {
            module('fireStarter.services');
            module("fbMocks");
            inject(function(_$log_, _$timeout_, _authMngr_, _$rootScope_, _$q_, _afEntity_, _mockAuth_) {
                $timeout = _$timeout_;
                $q = _$q_;
                $log = _$log_;
                afEntity = _afEntity_;
                $rootScope = _$rootScope_;
                authMngr = _authMngr_;
                mockAuth = _mockAuth_;
            });
            ref = mockAuth.ref();
            auth = mockAuth.makeAuth(ref);
            spyOn(afEntity, "set").and.returnValue(auth);
            spyOn($q, "when").and.callFake(function() {
                deferred = $q.defer();
                return deferred.promise;
            });
            authTest = authMngr();
        });
        afterEach(function() {
            ref = null;
            authMngr = null;
            mockAuth = null;
            afEntity = null;
        });
        describe("Constructor", function() {
            it("should be an object", function() {
                expect(authTest).toBeDefined();
            });
            it("should call afEntity.set 1 time", function() {
                expect(afEntity.set.calls.count()).toEqual(1);
            });
            it("should call afEntity.set with type === auth", function() {
                expect(afEntity.set.calls.argsFor(0)[0]).toEqual("auth");
            });
            // it('should call $q.when with correct auth obj', function() {
            //     expect($q.when).toHaveBeenCalledWith(auth);
            // });
            it('should return a firebaseArray', function() {
                // deferred.resolve(auth);
                // $rootScope.$digest();
                expect(authTest).toEqual(jasmine.objectContaining({
                    authWithPassword: jasmine.any(Function),
                    authWithOAuthPopup: jasmine.any(Function),
                    changePassword: jasmine.any(Function),
                    changeEmail: jasmine.any(Function),
                    createUser: jasmine.any(Function),
                    currentUID: jasmine.any(Function),
                    getAuth: jasmine.any(Function),
                    removeUser: jasmine.any(Function),
                    requireAuth: jasmine.any(Function),
                    resetPassword: jasmine.any(Function),
                    unauth: jasmine.any(Function),
                }));
            });
        });
        describe("authWithPassword", function() {
            beforeEach(function() {
                spyOn($log, 'info').and.callThrough();
                spyOn(auth, "$authWithPassword").and.callThrough();
                credentials = {
                    email: 'myname',
                    password: 'password'
                };
                authTest.authWithPassword(credentials);
                // deferred.resolve(auth);
                $rootScope.$digest();
								$timeout.flush();
            });
            it("should send credentials to firebase ref", function() {
                expect(auth.$authWithPassword).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authTest.authWithPassword(credentials);
                // deferred.resolve(auth);
                $rootScope.$digest();
                expect(test).toBeAPromise();
            });
        });
        // describe("authWithOAuthPopup", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$authWithOAuthPopup");
        //         credentials = {
        //             provider: 'google'
        //         };
        //         this.options = {
        //             remember: true,
        //             scope: "email"
        //         };
        //         authTest.authWithOAuthPopup(credentials);
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });
        //     it("should send credentials to firebase ref", function() {
        //         expect(auth.$authWithOAuthPopup).toHaveBeenCalledWith(credentials, this.options);
        //     });
        //     it("should return a promise", function() {
        //         var test = authTest.authWithOAuthPopup(credentials);
        //         expect(test).toBeAPromise();
        //     });
        // });
        // describe("removeUser", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$removeUser");
        //         credentials = {
        //             email: 'myname',
        //             password: 'password'
        //         };
        //         authTest.removeUser(credentials);
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });
        //     it("should send credentials to firebase ref", function() {
        //         expect(auth.$removeUser).toHaveBeenCalledWith(credentials);
        //     });
        //     it("should return a promise", function() {
        //         var test = authTest.removeUser(credentials);
        //         expect(test).toBeAPromise();
        //     });
        // });
        // describe("getAuth", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$getAuth");
        //         authTest.getAuth();
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });

        //     it("should send $getAuth to firebase ref", function() {
        //         expect(auth.$getAuth).toHaveBeenCalled();
        //     });
        //     it("currentUID() should send $getAuth to firebase ref", function() {
        //         authTest.currentUID();
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //         expect(auth.$getAuth).toHaveBeenCalled();
        //     });
        // });
        // describe("changeEmail", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$changeEmail");
        //         credentials = {
        //             password: 'myname123',
        //             newEmail: 'myemail@new.com',
        //             oldEmail: 'myemail@old.com'
        //         };
        //         authTest.changeEmail(credentials);
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });
        //     it("should send credentials to firebase ref", function() {
        //         expect(auth.$changeEmail).toHaveBeenCalledWith(credentials);
        //     });
        //     it("should return a promise", function() {
        //         var test = authTest.changeEmail(credentials);
        //         expect(test).toBeAPromise();
        //     });
        // });
        // describe("changePassword", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$changePassword");
        //         credentials = {
        //             email: 'myname',
        //             newPassword: 'passwowerd',
        //             oldPassword: 'password'
        //         };
        //         authTest.changePassword(credentials);
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });
        //     it("should send credentials to firebase ref", function() {
        //         expect(auth.$changePassword).toHaveBeenCalledWith(credentials);
        //     });
        //     it("should return a promise", function() {
        //         var test = authTest.changePassword(credentials);
        //         expect(test).toBeAPromise();
        //     });
        // });
        // describe("createUser", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$createUser");
        //         credentials = {
        //             email: 'myname',
        //             password: 'password'
        //         };
        //         authTest.createUser(credentials);
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });
        //     it("should send credentials to firebase ref", function() {
        //         expect(auth.$createUser).toHaveBeenCalledWith(credentials);
        //     });
        //     it("should return a promise", function() {
        //         var test = authTest.createUser(credentials);
        //         expect(test).toBeAPromise();
        //     });
        // });
        // describe("unauth", function() {
        //     beforeEach(function() {
        //         spyOn(auth, "$unauth");
        //         authTest.unauth()
        //         deferred.resolve(auth);
        //         $rootScope.$digest();
        //     });
        //     it("should send $unauth to firebase ref", function() {
        //         expect(auth.$unauth).toHaveBeenCalled();
        //     });
        //     it("should return a promise", function() {
        //         var test = authTest.unauth();
        //         expect(test).toBeAPromise();
        //     });
        // });
    });
})();
