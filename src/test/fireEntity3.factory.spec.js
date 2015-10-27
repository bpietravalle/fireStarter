(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        describe("with spies", function() {
            var firePath, sessionSpy, geo, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, geoSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;

            beforeEach(function() {
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
                module("fireStarter.services",
                    function($provide) {
                        $provide.service("fireStarter",
                            function($firebaseObject, $firebaseArray) {
                                return function(type, path, flag) {
                                    if (type === "object") {
                                        fbObject = jasmine.createSpyObj("fbObject", ["timestamp", "ref", "path", "bindTo", "destroy",
                                            "id", "priority", "value", "loaded", "remove", "save", "watch"
                                        ]);
                                        fsType = type;
                                        return fbObject;
                                    } else {
                                        fbArray = jasmine.createSpyObj("fbArray", ["timestamp", "ref", "path", "add", "destroy",
                                            "getRecord", "keyAt", "indexFor", "loaded", "remove", "save", "watch"
                                        ]);
                                        fsType = type;
                                        return fbArray;
                                    }

                                }


                            });

                        $provide.service("firePath",
                            function() {
                                return function(path, options) {
                                    // var userNestedSpy = jasmine.createSpy("userNestedPath");
                                    fsPath = path;
                                    pathSpy = {
                                        makeNested: jasmine.createSpy("makeNested"),
                                        mainArray: jasmine.createSpy("mainArray"),
                                        mainRecord: jasmine.createSpy("mainRecord"),
                                        nestedArray: jasmine.createSpy("nestedArray"), //.and.returnValue(userNestedSpy),
                                        nestedRecord: jasmine.createSpy("nestedRecord")
                                    };
                                    return pathSpy;
                                }
                            });
                    });
                inject(function(_firePath_, _location_, _sessionSpy_, _geo_, _$rootScope_, _fireEntity_, _inflector_, _fireStarter_, _$q_, _$log_, _user_) {
                    sessionSpy = _sessionSpy_;
                    $rootScope = _$rootScope_;
                    location = _location_;
                    geo = _geo_;
                    user = _user_;
                    inflector = _inflector_;
                    firePath = _firePath_;
                    fireEntity = _fireEntity_;
                    fireStarter = _fireStarter_;
                    $q = _$q_;
                    $log = _$log_;
                    $rootScope.session = {
                        getId: jasmine.createSpy("getId").and.callFake(function() {
                            return "mySessionId";
                        })
                    };
                });

                subject = fireEntity("path");

            });
            afterEach(function() {
                pathSpy = null;
                firePath = null;
                fireEntity = null;
                fireStarter = null;
            });
            it("should work", function() {
                expect(subject).toBeDefined();
            });
            // describe("User/Main combo methods", function() {
            //     beforeEach(function() {
            //         var main = {
            //             time: "today",
            //             duration: 1,
            //             outside: true
            //         }

            //         arrMock = fsMocks.fbArray(main);
            //         arrMock1 = fsMocks.fbArray();
            //         options = {
            //             user: true,
            //             geofire: true
            //         };
            //         subject = fireEntity("requests", options);
            // spyOn(subject,"mainArray").and.returnValue(arrMock);
            // spyOn(subject,"userNestedArray").and.returnValue(arrMock1);
            //         var test = subject.createUserAndMain(main);
            //         $rootScope.$digest();
            //         // arrMock.$ref().flush();
            //         // $rootScope.$digest();
            //         // arrMock1.$ref().flush();
            //         // $rootScope.$digest();
            //     });
            //     describe("createUserAndMain", function() {
            //         // it("nestedArray.mainArrayKey should equal key() of main Array", function() {
            //         //     expect(subject.userNestedArray().base().mainArrayKey).toEqual(subject.mainArray().base().$id);
            //         // });
            //         // think mock is saving data for both 2x 
            //         it("should only create one record for main array",function(){
            //         	expect(arrMock1.$ref()).toEqual("as");
            //         	// expect(subject.mainArray().base().length).toEqual(1);
            //         });
            //         // it("should only create one record for user nested array",function(){
            //         // 	expect(subject.userNestedArray().base().length).toEqual(1);
            //         // });
            //     });
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

})();
