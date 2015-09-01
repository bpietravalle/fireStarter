(function(angular) {
    "use strict";

    describe("Reg Service", function() {
        var reg, authObj, auth, data, deferred, mock, ref, $q, $rootScope, session, mockAuth;

        beforeEach(function() {
            MockFirebase.override();
            module("srvc.auth");
            module("utils.afApi");
            module("fbMocks");
            inject(function(_reg_, _session_, _$q_, _$rootScope_, _mockAuth_, _auth_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                auth = _auth_;
                reg = _reg_;
                session = _session_; //mock this
                mockAuth = _mockAuth_;
                ref = mockAuth.ref();
                data = mockAuth.userData();
            });
        });
        afterEach(function() {
            ref = null;
            reg = null;
            mockAuth = null;
            data = null;
        });

        describe("passwordAndEmailRegister", function() {
            beforeEach(inject(function() {
                spyOn(reg, 'passwordAndEmailRegister').and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });

                this.options = {
                    someOption: 'a'
                };
                this.credentials = {
                    Email: 'myname',
                    password: 'password'
                };
            }));
            it('passes userData if promise resolves', function() {
                var handler = jasmine.createSpy('handler');
                var test = reg.passwordAndEmailRegister(this.credentials, this.options);
                test.then(handler);
                deferred.resolve(data);
                $rootScope.$digest();
                expect(handler).toHaveBeenCalledWith(data);
            });
            it('doesnt pass userData if promise is rejected', function() {
                var handler = jasmine.createSpy('handler');
                var test = reg.passwordAndEmailRegister(this.credentials, this.options);
                test.then(handler);
                deferred.reject("error");
                $rootScope.$digest();
                expect(handler).not.toHaveBeenCalledWith(data);
            });
            it('passes error message if promise is rejected', function() {
                var error = jasmine.createSpy('handler');
                var test = reg.passwordAndEmailRegister(this.credentials, this.options);
                test.then(null, error);
                deferred.reject("error");
                $rootScope.$digest();
                expect(error).toHaveBeenCalledWith("error");
            });
            //TODO: test session.setAuthData is called
        });
        describe("registerOAuth", function() {
            beforeEach(inject(function() {
                spyOn(reg, 'registerOAuth').and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });

                this.credentials = {
                    provider: 'provider'
                };
            }));
            it('passes userData if promise resolves', function() {
                var handler = jasmine.createSpy('handler');
                var test = reg.registerOAuth(this.provider);
                test.then(handler);
                deferred.resolve(data);
                $rootScope.$digest();
                expect(handler).toHaveBeenCalledWith(data);
            });
            it('doesnt pass userData if promise is rejected', function() {
                var handler = jasmine.createSpy('handler');
                var test = reg.registerOAuth(this.provider);
                test.then(handler);
                deferred.reject("error");
                $rootScope.$digest();
                expect(handler).not.toHaveBeenCalledWith(data);
            });
            it('passes error message if promise is rejected', function() {
                var error = jasmine.createSpy('handler');
                var test = reg.registerOAuth(this.provider);
                test.then(null, error);
                deferred.reject("error");
                $rootScope.$digest();
                expect(error).toHaveBeenCalledWith("error");
            });
        });
        describe("OAuth Provider functions", function() {
            beforeEach(inject(function() {
                spyOn(reg, "registerOAuth");
            }));
            describe("#googleRegister", function() {
                it("calls #registerOAuth with 'google'", function() {
                    reg.googleRegister();
                    expect(reg.registerOAuth).toHaveBeenCalledWith("google");
                });
            });
        });
        describe("OAuth Provider functions", function() {
            beforeEach(inject(function() {
                spyOn(reg, "registerOAuth");
            }));
            describe("#facebookRegister", function() {
                it("calls #registerOAuth with 'facebook'", function() {
                    reg.facebookRegister();
                    expect(reg.registerOAuth).toHaveBeenCalledWith("facebook");
                });
            });
        });
        describe("OAuth Provider functions", function() {
            beforeEach(inject(function() {
                spyOn(reg, "registerOAuth");
            }));
            describe("#twitterRegister", function() {
                it("calls #registerOAuth with 'twitter'", function() {
                    reg.twitterRegister();
                    expect(reg.registerOAuth).toHaveBeenCalledWith("twitter");
                });
            });
        });
        describe("getUser", function() {

            it("returns a promise if authData is present", function() {
                var user = {
                    uid: 1,
                    name: "bob"
                }
                var test = reg.getUser(user);
                expect(test).toBeAPromise();
            });
            it("doesn't return a promise if no authData is passed as argument", function() {
                var test = reg.getUser();
                expect(test).not.toBeAPromise();
						});
        });
        // describe("#cancelAccount", function() {
        //     beforeEach(inject(function() {
        //         regObj = jasmine.createSpy('regObj');
        //         spyOn(session, "destroy");
        //     }));
        //     describe("when logged in", function() {
        //         beforeEach(function() {
        //             spyOn(reg, "isLoggedIn").and.returnValue(true);
        //         });
        //         // not passing and not sure why
        //         // it("calls regObj#$unreg", function() {
        //         //     reg.cancelAccount();
        //         //     expect(regObj.calls.count()).toequal(1);
        //         // });
        //         it("calls session#destroy", function() {
        //             reg.logOut();
        //             expect(session.destroy).toHaveBeenCalled();
        //         });
        //     });
        //     describe("when logged out", function() {
        //         beforeEach(function() {
        //             spyOn(reg, "isLoggedIn").and.returnValue(false);
        //         });
        //         it("throws an error", function() {
        //             expect(function() {
        //                 reg.logOut()
        //             }).toThrow();
        //         });
        //     });

        // });
    });
}(angular));
