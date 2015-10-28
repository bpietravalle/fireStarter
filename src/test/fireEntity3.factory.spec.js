(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        describe("with spies", function() {
            var firePath, sessionSpy, maSpy, maSpy1, mrSpy, naSpy, nrSpy, fsMocks, geo, test, ref, objRef, objCount, arrCount, arrRef, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, geoSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;

            beforeEach(function() {
                objCount = 0;
                arrCount = 0;
                angular.module("fireStarter.services")
                    .factory("sessionSpy", function() {
                        sessionSpy = jasmine.createSpyObj("sessionSpy", ["getId", "findId"]);
                        return sessionSpy;
                    })
                    .factory("location", function() {
                        locationSpy = jasmine.createSpyObj("locationSpy", ["buildArray", "buildObject"]);
                        return locationSpy;
                    })
                    .factory("geo", function() {
                        geoSpy = jasmine.createSpyObj("geoSpy", ["get", "set", "remove", "path"]);
                        return geoSpy;
                    })
                    .factory("user", function() {
                        userSpy = jasmine.createSpyObj("userSpy", ["getId", "findId"]);
                        return userSpy;
                    });
                module("fbMocks");
                module("fireStarter.services",
                    function($provide) {
                        $provide.service("firePath",
                            function() {
                                return function(path, options) {
                                    if (Array.isArray(path)) {
                                        path = path.join('/');
                                    }
                                    fsPath = path;
                                    pathSpy = {
                                        mainArray: jasmine.createSpy("mainArray").and.callFake(function() {
                                            // switch (arrCount) {
                                            //     case 0:
                                            maSpy = new MockFirebase('Mock://').child(fsPath);
                                            arrCount++;
                                            return maSpy;
                                            // case 1:
                                            //     maSpy1 = new MockFirebase('Mock://').child(fsPath);
                                            //     arrCount++;
                                            //     return maSpy1;
                                            // }
                                        }),
                                        mainRecord: jasmine.createSpy("mainRecord").and.callFake(function(id) {
                                            fsPath = path + "/" + id;
                                            mrSpy = new MockFirebase('Mock://').child(fsPath);
                                            return mrSpy;
                                        }),
                                        nestedArray: jasmine.createSpy("nestedArray").and.callFake(function(id, name) {
                                            fsPath = path + "/" + id + "/" + name;
                                            naSpy = new MockFirebase('Mock://').child(fsPath);
                                            return naSpy;
                                        }),
                                        nestedRecord: jasmine.createSpy("nestedRecord").and.callFake(function(id, name, recId) {
                                            fsPath = path + "/" + id + "/" + name + "/" + recId;
                                            nrSpy = new MockFirebase('Mock://').child(fsPath);
                                            return nrSpy;
                                        }),
                                    };
                                    return pathSpy;
                                }
                            });
                    });

                inject(function(_firePath_, _fsMocks_, _location_, _sessionSpy_, _geo_, _$rootScope_, _fireEntity_, _inflector_, _fireStarter_, _$q_, _$log_, _user_) {
                    sessionSpy = _sessionSpy_;
                    fsMocks = _fsMocks_;
                    $rootScope = _$rootScope_;
                    location = _location_;
                    geo = _geo_;
                    user = _user_;
                    inflector = _inflector_;
                    firePath = _firePath_;
                    fireEntity = _fireEntity_;
                    fireStarter = _fireStarter_;
                    $q = _$q_;
                    ref = fsMocks.stubRef();
                    $log = _$log_;
                    $rootScope.session = {
                        getId: jasmine.createSpy("getId").and.callFake(function() {
                            return "mySessionId";
                        })
                    };
                });
                options = {
                    pathFlag: true,
                    user: true,
                    geofire: true
                };

                subject = fireEntity("ref", options);

            });
            afterEach(function() {
                pathSpy = null;
                firePath = null;
                fireEntity = null;
                fireStarter = null;
            });
            describe("User/Main combo methods", function() {
                describe("createUserAndMain", function() {
                    beforeEach(function() {
                        var main = {
                            time: "today",
                            duration: 1,
                            outside: true
                        }
                        test = subject.createUserAndMain(main);
                        $rootScope.$digest();
                    });

                    it("should call the main Array", function() {
                        expect(pathSpy.mainArray).toHaveBeenCalled();
                        expect(maSpy).toEqual("as");
                    });
                    it("should call main Array again", function() {
                        // maSpy.flush();
                        // $rootScope.$digest();
                        // expect(pathSpy.mainArray.calls.count()).toEqual(2);
                        // expect(maSpy1).toBeDefined();
                    });

                    it("nestedArray.mainArrayKey should equal key() of main Array", function() {
                        // subject.userNestedArray();
                        // $rootScope.$digest();
                        // expect(pathSpy.mainArray).toHaveBeenCalled();
                        // expect(test.$$state.value.child("time")).toEqual("as");
                        //     expect(subject.userNestedArray().base().mainArrayKey).toEqual(subject.mainArray().base().$id);
                    });
                    // think mock is saving data for both 2x 
                    it("should only create one record for main array", function() {
                        // expect(test).toEqual("as");
                        // expect(subject.mainArray().base().length).toEqual(1);
                    });
                    // it("should only create one record for user nested array",function(){
                    // 	expect(subject.userNestedArray().base().length).toEqual(1);
                    // });
                });
                //     describe("loadMainFromUser", function() {
                //         // it("should find correct main record", function() {
                //         //     var uRec = subject.userNestedArray().base()
                //         //     var mainRec = subject.mainArray().base()
                //         //     var test = subject.loadMainFromUser(uRec);
                //         //     $rootScope.$digest();
                //         //     expect(uRec).toEqual(mainRec);
                //         // });
                //     });
                // describe("createWithUserAndGeo", function() {
                //     beforeEach(function() {
                //         arrMock = fsMocks.fbArray();
                //         spyOn(baseBuilder, "init").and.returnValue(arrMock);
                //         options = {
                //             user: true,
                //             geofire: true
                //         };
                //         subject = fireEntity("requests", options);
                //         test = subject.createWithUserAndGeo(newRecord, locData);
                //         $rootScope.$digest();
                //         arrMock.$ref().flush();
                //         $rootScope.$digest();
                //         arrMock.$ref().flush();
                //         $rootScope.$digest();
                //     });

                //     it("should add same main array key to each main location record", function() {
                //         // expect(test.$$state.value[0][1]['data'].mainArrayKey).toEqual(test.$$state.value[1][1]['data'].mainArrayKey);
                //     });
                //     it("log 1", function() {
                // var s = $log.info.calls.argsFor(0)[0];
                // expect(subject.locations(s).ref()).toEqual(2);

                //     });
                //     // it("log 2", function() {
                // // expect($log.info.calls.argsFor(1)).toEqual("as");
                //     // });
                //     // it("log 3", function() {
                // // expect($log.info.calls.argsFor(2)).toEqual("as");
                //     // });
                // });
            });
        });

    });

})();
