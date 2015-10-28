(function() {
    "use strict";
    describe("FireEntity Factory", function() {
        describe("with mocks", function() {
            var baseBuilder, objMock, deferred, rec, newRecord, arrMock1, locData, firePath, fullLocData, newData, test, test1, arrData, sessionSpy, fsMocks, arrMock, objMock, geo, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, geoSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;


            beforeEach(function() {
                arrData = {
                    "1": {
                        phone: "123456890",
                        firstName: "tom"
                    },
                    "2": {
                        phone: "0987654321",
                        firstName: "frank"
                    }
                };

                newData = {
                    phone: "111222333",
                    key: function() {
                        return "key";
                    },
                    firstName: "sally"
                };

                locData = [{
                    lat: 90,
                    lon: 100,
                    place_id: "string",
                    placeType: "a place",
                    distance: 1234,
                    closeBy: true
                }, {
                    lat: 45,
                    lon: 100,
                    place_id: "different_place",
                    placeType: "some place",
                    distance: 1000,
                    closeBy: false
                }];

                newRecord = {
                    phone: "111222333",
                    firstName: "sally"
                };

                MockFirebase.override();
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
                module("fireStarter.services");
                inject(function(_firePath_, _baseBuilder_, _fsMocks_, _location_, _sessionSpy_, _geo_, _$rootScope_, _fireEntity_, _inflector_, _fireStarter_, _$q_, _$log_, _user_) {
                    sessionSpy = _sessionSpy_;
                    baseBuilder = _baseBuilder_;
                    $rootScope = _$rootScope_;
                    location = _location_;
                    fsMocks = _fsMocks_;
                    arrMock = fsMocks.fbArray(arrData);
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
                            return "1";
                        })
                    };
                });
                spyOn($log, "info").and.callThrough();
                spyOn($q, "reject").and.callThrough();
            });
            afterEach(function() {
                locData = null;
                newRecord = null;
                newData = null;
                arrData = null;
                arrMock = null;
                pathSpy = null;
                firePath = null;
                fireEntity = null;
                fireStarter = null;
            });
            describe("Main Record methods", function() {

                describe("createMainRecord", function() {
                    beforeEach(function() {
                        arrMock = fsMocks.fbArray();
                        spyOn(baseBuilder, "init").and.returnValue(arrMock);
                        options = {
                            geofire: true,
                            user: true
                        };
                        subject = fireEntity("requests", options);
                    });
                    it("should return a promise", function() {
                        test = subject.createMainRecord(newRecord);
                        expect(test).toBeAPromise();
                    });
                    describe("user option", function() {
                        describe("if true", function() {
                            beforeEach(function() {
                                var data = {
                                    rec: newRecord,
                                    geo: locData
                                };
                                test1 = subject.createMainRecord(data, null, true);
                                arrMock.$ref().flush();
                                $rootScope.$digest();
                            });
                            it("should add uid property to record", function() {
                                expect(test1.$$state.value['data'].uid).toBeDefined();
                                expect(test1.$$state.value['data']).toBeDefined();
                            });
                        });
                        describe("if undefined", function() {
                            beforeEach(function() {
                                var data = {
                                    rec: newRecord,
                                    geo: locData
                                };
                                test1 = subject.createMainRecord(data);
                                arrMock.$ref().flush();
                                $rootScope.$digest();
                            });
                            it("should not add uid property to record", function() {
                                expect(test1.$$state.value['data'].uid).not.toBeDefined();
                                expect(test1.$$state.value['data']).toBeDefined();
                            });
                        });

                    });
                    describe("geo option", function() {
                        describe("if true", function() {
                            beforeEach(function() {
                                var data = {
                                    rec: newRecord,
                                    geo: locData
                                };
                                test1 = subject.createMainRecord(data, true);
                                arrMock.$ref().flush();
                                $rootScope.$digest();
                            });
                            it("should not send full data object to mainArray if arg = true", function() {
                                expect(test1.$$state.value['data'].geo).not.toBeDefined();
                                expect(test1.$$state.value['data']).toBeDefined();
                            });
                        });
                        describe("if undefined", function() {
                            beforeEach(function() {
                                var data = {
                                    rec: newRecord,
                                    geo: locData
                                };
                                test1 = subject.createMainRecord(data);
                                arrMock.$ref().flush();
                                $rootScope.$digest();
                            });
                            it("should not send full data object to mainArray if arg = true", function() {
                                expect(test1.$$state.value['data'].geo).toBeDefined();
                                expect(test1.$$state.value['data']).toBeDefined();
                            });
                        });
                    });
                    it("should send correct path args to fireStarter", function() {
                        test = subject.createMainRecord(newRecord);
                        $rootScope.$digest();
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(baseBuilder.init).toHaveBeenCalledWith("array", ["requests"], undefined);
                    });
                });
                describe("Remove", function() {
                    beforeEach(function() {
                        arrMock = fsMocks.fbArray(arrData);
                        spyOn(baseBuilder, "init").and.returnValue(arrMock);
                        options = {
                            geofire: true,
                        };
                        subject = fireEntity("requests", options);
                        $rootScope.$digest();
                        test = subject.removeMainRecord(0);
                        $rootScope.$digest();
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                    });
                    it("should remove the record", function() {
                        expect(subject.mainArray().base().length).toEqual(1);
                    });

                });
            });
            describe("Methods for user Nested Array", function() {
                beforeEach(function() {
                    spyOn(baseBuilder, "init").and.returnValue(arrMock);
                    options = {
                        user: true,
                    };
                    subject = fireEntity("requests", options);
                });
                describe("loadUserRecords", function() {
                    //TODO add option for loading indexes
                    beforeEach(function() {
                        test = subject.loadUserRecords();
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should send correct path args to fireStarter", function() {
                        expect(baseBuilder.init).toHaveBeenCalledWith("array", ["users", "1", "requests"], undefined);
                    });


                    it("should return correct data", function() {
                        expect(test.$$state.value[0].phone).toEqual(arrData["1"].phone);
                        expect(test.$$state.value[1].phone).toEqual(arrData["2"].phone);
                    });
                });
                describe("createUserRecord", function() {
                    beforeEach(function() {
                        test1 = subject.createUserRecord(newData);
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test1).toBeAPromise();
                    });
                    it("should send correct path args to fireStarter", function() {
                        expect(baseBuilder.init.calls.argsFor(0)[0]).toEqual("array");
                        expect(baseBuilder.init.calls.argsFor(0)[1]).toEqual(["users", "1", "requests"]);
                        expect(baseBuilder.init.calls.argsFor(0)[2]).toEqual(undefined);
                    });
                    it("should add record to array", function() {
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(arrMock.length).toEqual(3);
                    });
                    it("should return the firebaseRef", function() {
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(test1.$$state.value.ref()).toBeDefined();
                    });
                });
                describe("removeUserRecord", function() {
                    it("should remove the record", function() {
                        expect(subject.userNestedArray().base().length).toEqual(2);
                        test = subject.removeUserRecord(0);
                        $rootScope.$digest();
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(subject.userNestedArray().base().length).toEqual(1);
                    });

                });
            });
            describe("Methods Related to Geofire", function() {
                beforeEach(function() {
                    arrMock = fsMocks.fbArray();
                    spyOn(baseBuilder, "init").and.returnValue(arrMock);
                    options = {
                        geofire: true,
                        user: true
                    };
                    subject = fireEntity("requests", options);
                });

                describe("createLocationRecord", function() {
                    beforeEach(function() {
                        test = subject.createLocationRecord(locData);
                    });

                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should send correct path args to fireStarter", function() {
                        expect(baseBuilder.init).toHaveBeenCalledWith("array", ["locations", "requests"], undefined);
                    });

                    it("should add record to array", function() {
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(arrMock.length).toEqual(1);
                    });
                    it("should return firebaseRef of object", function() {
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(test.$$state.value.ref()).toBeDefined();
                    });
                    describe("geo option", function() {
                        describe("if true", function() {
                            beforeEach(function() {
                                test1 = subject.createLocationRecord(locData[0], true);
                                arrMock.$ref().flush();
                                $rootScope.$digest();
                            });
                            it("should not save lat or lon properties", function() {
                                expect(test1.$$state.value['data'].lat).not.toBeDefined();
                                expect(test1.$$state.value['data'].lon).not.toBeDefined();
                                expect(test1.$$state.value['data']).toBeDefined();
                            });
                        });
                        describe("if undefined", function() {
                            beforeEach(function() {
                                test1 = subject.createLocationRecord(locData[0]);
                                arrMock.$ref().flush();
                                $rootScope.$digest();
                            });
                            it("should not send full data object to mainArray if arg = true", function() {
                                expect(test1.$$state.value['data'].lat).toBeDefined();
                                expect(test1.$$state.value['data'].lon).toBeDefined();
                                expect(test1.$$state.value['data']).toBeDefined();
                            });
                        });
                    });
                });
                describe("createNestedLocationRecord", function() {
                    beforeEach(function() {
                        test1 = subject.createNestedLocationRecord(1, locData);
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test1).toBeAPromise();
                    });
                    it("should send correct path args to fireStarter", function() {
                        expect(baseBuilder.init.calls.argsFor(0)[0]).toEqual("array");
                        expect(baseBuilder.init.calls.argsFor(0)[1]).toEqual(["requests", 1, "locations"]);
                        expect(baseBuilder.init.calls.argsFor(0)[2]).toEqual(undefined);
                    });

                    it("should add record to array", function() {
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(arrMock.length).toEqual(1);
                    });
                    it("should return the firebaseRef", function() {
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(test1.$$state.value.ref()).toBeDefined();
                    });
                });
                describe("trackLocations", function() {
                    beforeEach(function() {
                        test = subject.trackLocations(locData, "string");
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                    });
                    it("should call set() on geoService for each location", function() {
                        expect(geoSpy.set.calls.count()).toEqual(locData.length);
                    });
                    it("should call geofire with the correct object name", function() {
                        expect(geoSpy.set.calls.argsFor(0)[0]).toEqual("requests");
                        expect(geoSpy.set.calls.argsFor(1)[0]).toEqual("requests");
                    });
                    it("should call geofire with mainLocation array key", function() {
                        expect(geoSpy.set.calls.argsFor(0)[1]).toEqual(test.$$state.value[0][1].ref().key());
                        expect(geoSpy.set.calls.argsFor(1)[1]).toEqual(test.$$state.value[1][1].ref().key());
                    });
                    it("should call geofire with correct coordinates", function() {
                        expect(geoSpy.set.calls.argsFor(0)[2]).toEqual([locData[0].lat, locData[0].lon]);
                        expect(geoSpy.set.calls.argsFor(1)[2]).toEqual([locData[1].lat, locData[1].lon]);
                    });

                    it("should add same main array key to each main location record", function() {
                        expect(test.$$state.value[1][1]['data'].mainArrayKey).toEqual("string");
                        expect(test.$$state.value[0][1]['data'].mainArrayKey).toEqual("string");
                    });

                });
                describe("untrackLocations", function() {
                    beforeEach(function() {
                        test = subject.trackLocations(locData, "string");
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                    });
                    it("should remove record of each record provided", function() {
                        expect(subject.locations("string").base().length).toEqual(2);
                        var rec = subject.locations("string").base()[0];
                        subject.untrackLocations([rec]);
                        $rootScope.$digest();
                        $rootScope.$digest();
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(subject.locations("string").base().length).toEqual(1);
                    });
                    it("should remove record if only provide key instead", function() {
                        expect(subject.locations("string").base().length).toEqual(2);
                        var rec = subject.locations("string").base()[0].$id;
                        subject.untrackLocations([rec]);
                        $rootScope.$digest();
                        $rootScope.$digest();
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(subject.locations("string").base().length).toEqual(1);
                    });
                    it("should call geofire service correct number of times with correct args", function() {
                        var rec = subject.locations("string").base()[0];
                        subject.untrackLocations([rec]);
                        $rootScope.$digest();
                        $rootScope.$digest();
                        arrMock.$ref().flush();
                        $rootScope.$digest();
                        expect(geoSpy.remove.calls.count()).toEqual(1);
                        expect(geoSpy.remove.calls.argsFor(0)[0]).toEqual("requests");
                        expect(geoSpy.remove.calls.argsFor(0)[1]).toEqual(rec.$id);
                    });

                });
            });
        });
    });
})();
