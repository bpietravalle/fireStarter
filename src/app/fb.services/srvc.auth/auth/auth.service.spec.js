(function(angular) {
    "use strict";

    describe("Auth Service", function() {
        var auth, user, error, $log, data, deferred, mockObj, credentials, ref, $q, authMngr, $rootScope, session, mockAuth;

        beforeEach(function() {
            MockFirebase.override();
            module("fb.srvc.auth");
            module("fbMocks");
            inject(function(_$log_, _user_, _auth_, _authMngr_, _mockObj_, _session_, _$q_, _$rootScope_, _mockAuth_) {
                $rootScope = _$rootScope_;
                $log = _$log_;
                user = _user_;
                $q = _$q_;
                authMngr = _authMngr_;
                auth = _auth_;
                session = _session_;
                mockObj = _mockObj_;
                mockAuth = _mockAuth_;
                ref = mockAuth.ref();
                data = mockAuth.authData();
                error = "Error!!!";
            });
        });
        afterEach(function() {
            ref = null;
            auth = null;
            mockAuth = null;
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
                inject(function() {
                    spyOn(authMngr, 'authWithPassword').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });

                this.credentials = {
                    email: 'myname',
                    pass: 'password'
                };
                auth.passwordAndEmailLogin(this.credentials);
                spyOn(session, "setAuthData");
                spyOn($q, "reject");

            });
            describe("***When Resolved:  ", function() {
                it("auth service should return authData", function() {
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect(deferred.promise.$$state.value).toEqual(data);
                });
                it("should call session.setAuthData with authData", function() {
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect(session.setAuthData).toHaveBeenCalledWith(data);
                });
                it("shouldn't call $q.reject", function() {
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            describe("***When Rejected:  ", function() {
                it("auth service is undefined", function() {
                    var test = auth.passwordAndEmailLogin(this.credentials);
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect(angular.isUndefined(test.$$state.value)).toBeTruthy();
                });
                it("shouldn't call session.setAuthData with authData", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect(session.setAuthData).not.toHaveBeenCalledWith(data);
                });
                it("should call $q.reject", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });

        describe("loginOAuth", function() {
            beforeEach(function() {
                inject(function() {
                    spyOn(authMngr, 'authWithOAuthPopup').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                this.credentials = {
                    provider: 'provider'
                };

                auth.loginOAuth(this.credentials);
                spyOn(session, "setAuthData").and.callThrough();
                spyOn($q, "reject");

            });
            describe("***When Resolved:  ", function() {
                it("auth service should return authData", function() {
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect(deferred.promise.$$state.value).toEqual(data);
                });
                it("should call session.setAuthData with authData", function() {
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect(session.setAuthData).toHaveBeenCalledWith(data);
                    expect(session.getAuthData()).toEqual(data);
                });
                it("shouldn't call $q.reject", function() {
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            describe("***When Rejected:  ", function() {
                it("shouldn't call session.setAuthData with authData", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect(session.setAuthData).not.toHaveBeenCalledWith(data);
                });
                it("should call $q.reject", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });

        describe("OAuth Provider functions", function() {
            beforeEach(inject(function() {
                spyOn(auth, "loginOAuth");
            }));
            describe("#googleLogin", function() {
                it("calls #loginOAuth with 'google'", function() {
                    auth.googleLogin();
                    expect(auth.loginOAuth).toHaveBeenCalledWith("google");
                });
            });
            describe("#facebookLogin", function() {
                it("calls #loginOAuth with 'facebook'", function() {
                    auth.facebookLogin();
                    expect(auth.loginOAuth).toHaveBeenCalledWith("facebook");
                });
            });
            describe("#twitterLogin", function() {
                it("calls #loginOAuth with 'twitter'", function() {
                    auth.twitterLogin();
                    expect(auth.loginOAuth).toHaveBeenCalledWith("twitter");
                });
            });
        });
        describe("changeEmail", function() {
            beforeEach(function() {
                inject(function() {
                    spyOn(authMngr, 'changeEmail').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                credentials = {
                    oldEmail: 'oldone@email.com',
                    newEmail: 'newone@email.com',
                    password: 'password'
                };
                this.success = "email successfully changed";

                var info = {
                    uid: '1',
                    email: 'oldone@email.com'
                };
                spyOn($q, "reject");
                spyOn($log, "error");

                this.mockUser = mockObj.makeObject(info);
            });

            describe("***When Resolved:  ", function() {
                it("should call currentUID on authMngr", function() {
                    spyOn(authMngr, 'currentUID');
                    spyOn(user, 'findById');
                    auth.changeEmail(credentials);
                    deferred.resolve("success");
                    $rootScope.$digest();
                    expect(authMngr.currentUID).toHaveBeenCalled();
                });
                it("should send the currentUID to user.findById", function() {
                    spyOn(authMngr, 'currentUID').and.returnValue('1');
                    spyOn(user, 'findById');
                    auth.changeEmail(credentials);
                    deferred.resolve("success");
                    $rootScope.$digest();
                    expect(user.findById).toHaveBeenCalledWith('1');
                });
                it("should call user.save with user obj", function() {
                    spyOn(authMngr, 'currentUID');
                    spyOn(user, 'findById').and.returnValue(this.mockUser);
                    spyOn(user, 'save');
                    auth.changeEmail(credentials);
                    deferred.resolve("success");
                    $rootScope.$digest();
                    expect(user.save).toHaveBeenCalledWith(this.mockUser);
                });
                it("should update users email address", function() {
                    spyOn(authMngr, 'currentUID');
                    spyOn(user, 'findById').and.returnValue(this.mockUser);
                    spyOn(user, 'save');
                    auth.changeEmail(credentials);
                    deferred.resolve("success");
                    $rootScope.$digest();
                    expect(this.mockUser.email).toEqual('newone@email.com');
                });
                it("$q.reject isnt called", function() {
                    deferred.resolve("success");
                    $rootScope.$digest();
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            describe("***When Rejected:  ", function() {
                it("should call $log.error", function() {
                    auth.changeEmail(credentials);
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($log.error).toHaveBeenCalledWith(error);
                });
                it("should call $q.reject", function() {
                    auth.changeEmail(credentials);
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });
        describe("changePassword", function() {
            describe("With Invalid params", function() {

                it("throws an error if email is blank", function() {
                    var params = {
                        email: "",
                        oldPassword: 'password',
                        confirm: 'passWORD',
                        newPassword: 'passWORD'
                    };
                    expect(function() {
                        auth.changePassword(params);
                    }).toThrow();
                });
                it("throws an error if password is blank", function() {
                    var params = {
                        email: "email@emial.som",
                        oldPassword: "",
                        confirm: 'passWORD',
                        newPassword: 'passWORD'
                    };
                    expect(function() {
                        auth.changePassword(params);
                    }).toThrow();
                });
                it("throws an error if password !== confirmation", function() {
                    var params = {
                        email: "email@emial.som",
                        oldPassword: 'password',
                        confirm: 'paasdasdssWORD',
                        newPassword: 'passWORD'
                    };
                    expect(function() {
                        auth.changePassword(params);
                    }).toThrow();
                });
            });
            beforeEach(function() {
                inject(function() {
                    spyOn(authMngr, 'changePassword').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                var credentials = {
                    email: 'oldone@email.com',
                    oldPassword: 'password',
                    confirm: 'passWORD',
                    newPassword: 'passWORD'
                };
                this.success = "password successfully changed";

                auth.changePassword(credentials);
                spyOn($log, "info");
                spyOn($q, "reject");

            });
            describe("***When Resolved:  ", function() {
                it("should call $log.info with success message", function() {
                    deferred.resolve(this.success);
                    $rootScope.$digest();
                    expect($log.info).toHaveBeenCalledWith(this.success);
                });
                it("shouldn't call $q.reject", function() {
                    deferred.resolve(this.success);
                    $rootScope.$digest();
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            describe("***When Rejected:  ", function() {
                it("shouldn't call $log.info", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($log.info).not.toHaveBeenCalledWith(this.success);
                });
                it("should call $q.reject", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });
        describe("resetPassword", function() {
            beforeEach(function() {
                inject(function() {
                    spyOn(authMngr, 'resetPassword').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                this.credentials = {
                    email: 'oldone@email.com',
                };
                this.success = "password reset email sent";

                auth.resetPassword(this.credentials);
                spyOn($log, "info");
                spyOn($q, "reject");

            });
            describe("***When Resolved:  ", function() {
                it("should call $log.info with success message", function() {
                    deferred.resolve(this.success);
                    $rootScope.$digest();
                    expect($log.info).toHaveBeenCalledWith(this.success);
                });
                it("shouldn't call $q.reject", function() {
                    deferred.resolve(this.success);
                    $rootScope.$digest();
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            describe("***When Rejected:  ", function() {
                it("shouldn't call $log.info", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($log.info).not.toHaveBeenCalledWith(this.success);
                });
                it("should call $q.reject", function() {
                    deferred.reject(error);
                    $rootScope.$digest();
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });
        describe("#logout", function() {
            beforeEach(inject(function() {
                spyOn(authMngr, 'unauth');
                spyOn(session, "destroy");
            }));
            describe("when logged in", function() {
                beforeEach(function() {
                    spyOn(auth, "isLoggedIn").and.returnValue(true);
                });
                it("calls authObj#unauth", function() {
                    auth.logOut();
                    expect(authMngr.unauth).toHaveBeenCalled();
                });
                it("calls session#destroy", function() {
                    auth.logOut();
                    expect(session.destroy).toHaveBeenCalled();
                });
            });
            describe("when logged out", function() {
                beforeEach(function() {
                    spyOn(auth, "isLoggedIn").and.returnValue(false);
                });
                it("throws an error and doesn't call session#destroy or unauth", function() {
                    expect(function() {
                        auth.logOut();
                    }).toThrow();
                    expect(authMngr.unauth).not.toHaveBeenCalled();
                    expect(session.destroy).not.toHaveBeenCalled();
                });

            });
        });
    });
})(angular);
