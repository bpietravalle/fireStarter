(function() {
    "use strict";
    describe("Auth Manager", function() {
        var credentials, authMngr, afEntity, ref, $rootScope, mockAuth;

        beforeEach(function() {
            module('fireStarter.services');
            module("fbMocks");
            inject(function(_authMngr_, _$rootScope_, _afEntity_, _mockAuth_) {
                afEntity = _afEntity_;
                $rootScope = _$rootScope_;
                authMngr = _authMngr_;
                mockAuth = _mockAuth_;
            });
            ref = mockAuth.authObj;
            spyOn(afEntity, "set").and.returnValue(ref);
        });
        afterEach(function() {
            ref = null;
            authMngr = null;
            mockAuth = null;
        });
        describe("authObj", function() {
            it("should be an object", function() {
                expect(ref).toBeDefined();
            });
            it("should be defined", function() {
                expect(typeof ref).toEqual('object');
            });
        });
        describe("authWithPassword", function() {
            beforeEach(function() {
                credentials = {
                    email: 'myname',
                    password: 'password'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.authWithPassword(credentials);
                expect(ref.$authWithPassword).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.authWithPassword(credentials);
                expect(test).toBeAPromise();
            });
        });
        describe("authWithOAuthPopup", function() {
            beforeEach(function() {
                credentials = {
                    provider: 'google'
                };
                this.options = {
                    remember: true,
                    scope: "email"
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.authWithOAuthPopup(credentials);
                expect(ref.$authWithOAuthPopup).toHaveBeenCalledWith(credentials, this.options);
            });
            it("should return a promise", function() {
                var test = authMngr.authWithOAuthPopup(credentials);
                expect(test).toBeAPromise();
            });
        });
        describe("removeUser", function() {
            beforeEach(function() {
                credentials = {
                    email: 'myname',
                    password: 'password'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.removeUser(credentials);
                expect(ref.$removeUser).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.removeUser(credentials);
                expect(test).toBeAPromise();
            });
        });
        describe("getAuth", function() {
            it("should send $getAuth to firebase ref", function() {
                authMngr.getAuth();
                expect(ref.$getAuth).toHaveBeenCalled();
            });
        });
        describe("currentUID", function() {
            it("should send $getAuth to firebase ref", function() {
                authMngr.currentUID();
                expect(ref.$getAuth).toHaveBeenCalled();
            });
        });
        describe("changeEmail", function() {
            beforeEach(function() {
                credentials = {
                    password: 'myname123',
                    newEmail: 'myemail@new.com',
                    oldEmail: 'myemail@old.com'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.changeEmail(credentials);
                $rootScope.$digest();
                expect(ref.$changeEmail).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.changeEmail(credentials);
                expect(test).toBeAPromise();
            });
        });
        describe("changePassword", function() {
            beforeEach(function() {
                credentials = {
                    email: 'myname',
                    newPassword: 'passwowerd',
                    oldPassword: 'password'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.changePassword(credentials);
                expect(ref.$changePassword).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.changePassword(credentials);
                expect(test).toBeAPromise();
            });
        });
        describe("createUser", function() {
            beforeEach(function() {
                credentials = {
                    email: 'myname',
                    password: 'password'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.createUser(credentials);
                expect(ref.$createUser).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.createUser(credentials);
                expect(test).toBeAPromise();
            });
        });
        describe("unauth", function() {
            it("should send $unauth to firebase ref", function() {
                authMngr.unauth();
                expect(ref.$unauth).toHaveBeenCalled();
            });
            it("should not return a promise or any value", function() {
                var test = authMngr.unauth();
                expect(test).not.toBeAPromise();
            });
        });
    });
})();
