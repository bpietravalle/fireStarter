// (function() {
//     "use strict";

//     describe("Reg Service", function() {
//         var reg, user, auth, data, deferred, deferred1, ref, $q, mockObj, $rootScope, session, mockAuth;

//         beforeEach(function() {
//             MockFirebase.override();
//             module("fb.srvc.auth");
//             module("utils.afApi");
//             module("fbMocks");
//             inject(function(_reg_, _user_, _session_, _$q_, _$rootScope_, _mockObj_, _mockAuth_, _auth_) {
//                 $rootScope = _$rootScope_;
//                 $q = _$q_;
//                 user = _user_;
//                 auth = _auth_;
//                 reg = _reg_;
//                 session = _session_;
//                 mockObj = _mockObj_;
//                 mockAuth = _mockAuth_;
//                 ref = mockAuth.ref();
//                 data = mockAuth.userData();
//             });
//         });
//         afterEach(function() {
//             ref = null;
//             reg = null;
//             mockAuth = null;
//             data = null;
//             deferred = null;
//             deferred1 = null;
//         });
//         describe("passwordAndEmailRegister", function() {
//             describe("With Invalid params", function() {

//                 it("throws an error if email is blank", function() {
//                     var params = {
//                         email: "",
//                         password: "password",
//                         confirm: "password"
//                     };
//                     expect(function() {
//                         reg.passwordAndEmailRegister(params);
//                     }).toThrow();
//                 });
//                 it("throws an error if password is blank", function() {
//                     var params = {
//                         email: "email@emial.som",
//                         password: "",
//                         confirm: "password"
//                     };
//                     expect(function() {
//                         reg.passwordAndEmailRegister(params);
//                     }).toThrow();
//                 });
//                 it("throws an error if password !== confirmation", function() {
//                     var params = {
//                         email: "email@emial.som",
//                         password: "pass",
//                         confirm: "password"
//                     };
//                     expect(function() {
//                         reg.passwordAndEmailRegister(params);
//                     }).toThrow();
//                 });
//             });
//             describe("With Valid Params", function() {

//                 beforeEach(inject(function() {
//                     spyOn(auth.authObj, '$createUser').and.callFake(function() {
//                         deferred = $q.defer();
//                         return deferred.promise;
//                     });
//                     this.registration = {
//                         email: 'myname@emial.com',
//                         password: 'password',
//                         confirm: 'password'
//                     };
//                     this.data = {
//                         email: this.registration.email,
//                         password: this.registration.password
//                     };
//                     this.error = "Error";
//                     spyOn($q, "reject");

//                 }));
//                 describe("When $createUser is Resolved", function() {
//                     describe("Before authentication", function() {
//                         beforeEach(inject(function() {
//                             spyOn(auth, "passwordAndEmailLogin").and.callThrough();
//                         }));
//                         it('should be a promise', function() {
//                             var test = reg.passwordAndEmailRegister(this.registration);
//                             deferred.resolve(this.data);
//                             $rootScope.$digest();
//                             expect(test).toBeAPromise();
//                         });
//                         it('should pass userData auth.passwordAndEmailLogin', function() {
//                             reg.passwordAndEmailRegister(this.registration);
//                             deferred.resolve(this.data);
//                             $rootScope.$digest();
//                             expect(auth.passwordAndEmailLogin).toHaveBeenCalledWith(this.data);
//                         });
//                     });
//                     describe("After authentication", function() {
//                         beforeEach(inject(function() {
//                             spyOn(auth, 'passwordAndEmailLogin').and.callFake(function() {
//                                 deferred1 = $q.defer();
//                                 return deferred1.promise;
//                             });
//                         }));

//                         describe("before retrieving user object", function() {
//                             beforeEach(inject(function() {
//                                 spyOn(user, 'findById').and.callThrough();
//                             }));
//                             describe("When Resolved", function() {
//                                 it('should pass authData.uid to user factory', function() {
//                                     reg.passwordAndEmailRegister(this.registration);
//                                     deferred.resolve(this.data);
//                                     $rootScope.$digest();
//                                     deferred1.resolve(data);
//                                     $rootScope.$digest();
//                                     expect(user.findById).toHaveBeenCalledWith(data.uid);
//                                 });
//                             });
//                             describe("When Rejected", function() {
//                                 it('should not pass authData to user factory', function() {
//                                     reg.passwordAndEmailRegister(this.registration);
//                                     deferred.resolve(this.data);
//                                     $rootScope.$digest();
//                                     deferred1.reject(this.error);
//                                     $rootScope.$digest();
//                                     expect(user.findById).not.toHaveBeenCalledWith(data);
//                                 });
//                                 it('should send error to $q', function() {
//                                     reg.passwordAndEmailRegister(this.registration);
//                                     deferred.resolve(this.data);
//                                     $rootScope.$digest();
//                                     deferred1.reject(this.error);
//                                     $rootScope.$digest();
//                                     expect($q.reject).toHaveBeenCalledWith(this.error);
//                                 });
//                             });
//                         });

//                         describe("after retrieving the user object", function() {
//                             beforeEach(inject(function() {
//                                 spyOn(user, 'save').and.callThrough();
//                                 spyOn(user, 'findById').and.callThrough();
//                             }));
//                             describe("When Resolved", function() {
//                                 it('should set the user data', function() {
//                                     reg.passwordAndEmailRegister(this.registration);
//                                     deferred.resolve(this.data);
//                                     $rootScope.$digest();
//                                     deferred1.resolve(data);
//                                     $rootScope.$digest();
//                                     expect(user.save).toHaveBeenCalledWith(jasmine
//                                         .objectContaining({
//                                             email: this.data.email,
//                                             name: "Myname"
//                                         }));
//                                 });
//                             });
//                         });
//                     });
//                     describe("When $createUser is Rejected", function() {
//                         it('should send error to $q.error', function() {
//                             reg.passwordAndEmailRegister(this.registration);
//                             deferred.reject(this.error);
//                             $rootScope.$digest();
//                             expect($q.reject).toHaveBeenCalledWith(this.error);
//                         });

//                     });
//                 });
//             });
//         });
//         describe("registerOAuth", function() {
//             beforeEach(function() {
//                 spyOn(user, "findById").and.callThrough();
//                 spyOn(user, 'save').and.callThrough();
//                 spyOn($q, 'reject');

//                 inject(function() {
//                     spyOn(auth, 'loginOAuth').and.callFake(function() {
//                         deferred = $q.defer();
//                         return deferred.promise;
//                     });
//                 });
//                 this.data = {
//                     uid: '1',
//                     google: {
//                         email: 'my@email.com',
//                         displayName: 'My Name'
//                     }
//                 };

//                 this.credentials = {
//                     provider: 'google'
//                 };
//             });
//             describe("When Resolved", function() {
//                 it('passes authData.uid to user.findById', function() {
//                     reg.registerOAuth(this.credentials);
//                     deferred.resolve(this.data);
//                     $rootScope.$digest();
//                     expect(user.findById).toHaveBeenCalledWith(this.data.uid);
//                 });
//                 it('passes the updated user obj to user.save', function() {
//                     reg.registerOAuth(this.credentials);
//                     deferred.resolve(this.data);
//                     $rootScope.$digest();
//                     expect(user.save).toHaveBeenCalledWith(
//                         jasmine.objectContaining({
//                             email: 'my@email.com',
//                             name: 'My Name'
//                         }));
//                 });
//             });
//             describe("When Rejected", function() {
//                 it('doesnt pass authData or try to save', function() {
//                     reg.registerOAuth(this.credentials);
//                     deferred.reject("error");
//                     $rootScope.$digest();
//                     expect(user.findById).not.toHaveBeenCalledWith(data);
//                     expect(user.save).not.toHaveBeenCalled();
//                 });
//                 it('passes error message if promise is rejected', function() {
//                     reg.registerOAuth(this.credentials);
//                     deferred.reject("error");
//                     $rootScope.$digest();
//                     expect($q.reject).toHaveBeenCalledWith("error");
//                 });
//             });
//         });
//         describe("OAuth Provider functions", function() {
//             beforeEach(inject(function() {
//                 spyOn(reg, "registerOAuth");
//             }));
//             describe("#googleRegister", function() {
//                 it("calls #registerOAuth with 'google'", function() {
//                     reg.googleRegister();
//                     expect(reg.registerOAuth).toHaveBeenCalledWith("google");
//                 });
//             });
//             describe("#facebookRegister", function() {
//                 it("calls #registerOAuth with 'facebook'", function() {
//                     reg.facebookRegister();
//                     expect(reg.registerOAuth).toHaveBeenCalledWith("facebook");
//                 });
//             });
//             describe("#twitterRegister", function() {
//                 it("calls #registerOAuth with 'twitter'", function() {
//                     reg.twitterRegister();
//                     expect(reg.registerOAuth).toHaveBeenCalledWith("twitter");
//                 });
//             });
//         });
//         describe("#cancelAccount", function() {
//             beforeEach(function() {
// 							spyOn(auth, "logOut").and.callThrough();
// 							spyOn($q, "reject");
//                 inject(function() {
//                     spyOn(auth.authObj, "$removeUser").and.callFake(function() {
//                         deferred = $q.defer();
//                         return deferred.promise;
//                     });
//                 });
// 								this.creds = {
// 									email: "my@email.com",
// 									password: "password"
// 								};
//             });
//             describe("when logged in & resolved", function() {
//                 beforeEach(function() {
//                     spyOn(auth, "isLoggedIn").and.returnValue(true);
//                 });
//                 it("calls auth.logOut after auth.authObj.$remove", function() {
//                     reg.cancelAccount(this.creds);
// 										deferred.resolve(this.creds);
// 										$rootScope.$digest();
//                     expect(auth.authObj.$removeUser).toHaveBeenCalled();
//                     expect(auth.logOut).toHaveBeenCalled();
//                 });
//             });
//             describe("when logged out", function() {
//                 beforeEach(function() {
//                     spyOn(auth, "isLoggedIn").and.returnValue(false);
//                 });
//                 it("throws an error", function() {
//                     expect(function() {
//                         reg.cancelAccount();
//                     }).toThrow();
//                 });
//             });

//         });
//     });
// })(angular);
