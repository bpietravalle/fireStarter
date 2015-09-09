(function(angular) {
    "use strict";
    describe("Auth Manager", function() {
        var credentials, authMngr, ref, $rootScope, mockAuth;

        beforeEach(function() {
            MockFirebase.override();
            module("fb.srvc.dataMngr");
            module("fbMocks");
            inject(function(_authMngr_, _$rootScope_, _mockAuth_) {
                $rootScope = _$rootScope_;
                authMngr = _authMngr_;
                ref = authMngr.authObj;
                mockAuth = _mockAuth_;
            });
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
                spyOn(ref, '$authWithPassword').and.callThrough();
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
                spyOn(ref, '$authWithOAuthPopup').and.callThrough();
                credentials = {
                    provider: 'google'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.authWithOAuthPopup(credentials);
                expect(ref.$authWithOAuthPopup).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.authWithOAuthPopup(credentials);
                expect(test).toBeAPromise();
            });
				});
        describe("removeUser", function() {
            beforeEach(function() {
                spyOn(ref, '$removeUser').and.callThrough();
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
            beforeEach(function() {
                spyOn(ref, '$getAuth').and.callThrough();
               
            });
            it("should send $getAuth to firebase ref", function() {
                authMngr.getAuth();
                expect(ref.$getAuth).toHaveBeenCalled();
            });
				});
        describe("currentUID", function() {
            beforeEach(function() {
                spyOn(ref, '$getAuth').and.callThrough();
               
            });
            it("should send $getAuth to firebase ref", function() {
                authMngr.currentUID();
                expect(ref.$getAuth).toHaveBeenCalled();
            });
				});
        describe("changeEmail", function() {
            beforeEach(function() {
                spyOn(ref, '$changeEmail').and.callThrough();
                credentials = {
                    password: 'myname123',
                    newEmail: 'myemail@new.com',
                    oldEmail: 'myemail@old.com'
                };
            });
            it("should send credentials to firebase ref", function() {
                authMngr.changeEmail(credentials);
                expect(ref.$changeEmail).toHaveBeenCalledWith(credentials);
            });
            it("should return a promise", function() {
                var test = authMngr.changeEmail(credentials);
                expect(test).toBeAPromise();
            });
				});
        describe("changePassword", function() {
            beforeEach(function() {
                spyOn(ref, '$changePassword').and.callThrough();
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
                spyOn(ref, '$createUser').and.callThrough();
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
            beforeEach(function() {
                spyOn(ref, '$unauth').and.callThrough();
            });
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
})(angular);
