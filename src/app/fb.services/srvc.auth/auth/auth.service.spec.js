(function(angular) {
    "use strict";

    describe("Auth Service", function() {
        var auth, user, error, $log, data, deferred, ref, $q, $rootScope, session, mockAuth;

        beforeEach(function() {
            MockFirebase.override();
            module("fb.srvc.auth");
            module("fbMocks");
            inject(function(_$log_, _user_, _auth_, _session_, _$q_, _$rootScope_, _mockAuth_) {
                $rootScope = _$rootScope_;
                $log = _$log_;
                user = _user_;
                $q = _$q_;
                auth = _auth_;
                session = _session_;
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
                    spyOn(auth.authObj, '$authWithPassword').and.callFake(function() {
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
                    var test = auth.passwordAndEmailLogin(this.credentials);
                    deferred.resolve(data);
                    $rootScope.$digest();
                    expect(test.$$state.value).toEqual(data);
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
                    spyOn(auth.authObj, '$authWithOAuthPopup').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                this.credentials = {
                    provider: 'provider'
                };

                auth.loginOAuth(this.credentials);
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
                    spyOn(auth.authObj, '$changeEmail').and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                this.credentials = {
                    oldEmail: 'oldone@email.com',
                    newEmail: 'newone@email.com',
                    password: 'password'
                };
                this.success = "email successfully changed";

                auth.changeEmail(this.credentials);
                spyOn($log, "info");
                spyOn($q, "reject");

            });
            describe("***When Resolved:  ", function() {
                describe("before updating email in firebase", function() {
                    beforeEach(function() {
                        var u = {
                            uid: 1,
                            email: 'oldone@email.com'
                        };
                        spyOn(user, "save");
                        spyOn(session, "getAuthData").and.returnValue(u);
                        spyOn(user, "findById").and.returnValue(u);
                    });
                    it("user.save is called with updated user", function() {
                        var newU = {
                            uid: 1,
                            email: 'newone@email.com'
                        };
                        deferred.resolve(this.success);
                        $rootScope.$digest();
                        expect(user.save).toHaveBeenCalledWith(newU);
                    });
                });
                describe("after updating email in firebase", function() {
                    beforeEach(function() {
                        var u = {
                            uid: 1,
                            email: 'oldone@email.com'
                        };
                        spyOn(session, "getAuthData").and.returnValue(u);
                        spyOn(user, "findById").and.returnValue(u);
                        spyOn(user, 'save').and.callFake(function() {
                            deferred = $q.defer();
                            return deferred.promise;
                        });

                    });
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
                    spyOn(auth.authObj, '$changePassword').and.callFake(function() {
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
                    spyOn(auth.authObj, '$resetPassword').and.callFake(function() {
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
                spyOn(auth.authObj, '$unauth');
                spyOn(session, "destroy");
            }));
            describe("when logged in", function() {
                beforeEach(function() {
                    spyOn(auth, "isLoggedIn").and.returnValue(true);
                });
                it("calls authObj#$unauth", function() {
                    auth.logOut();
                    expect(auth.authObj.$unauth).toHaveBeenCalled();
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
                it("throws an error and doesn't call session#destroy or $unauth", function() {
                    expect(function() {
                        auth.logOut();
                    }).toThrow();
                    expect(auth.authObj.$unauth).not.toHaveBeenCalled();
                    expect(session.destroy).not.toHaveBeenCalled();
                });

            });
        });
    });
}(angular));
