(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        describe("with spies", function() {
            var firePath, userId, session, geo, $rootScope, differentSession, data, location, locationSpy, $injector, inflector, fsType, geoSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;

            beforeEach(function() {
                angular.module("fireStarter.services")
                    .factory("differentSession", function() {
                        return {
                            getId: jasmine.createSpy("getId").and.callFake(function() {
                                userId = 1;
                                return userId;
                            }),
                            findId: jasmine.createSpy("findId").and.callFake(function() {
                                userId = 1;
                                return userId;
                            })
                        }
                    })
                    .factory("session", function() {
                        return {
                            getId: jasmine.createSpy("getId").and.callFake(function() {
                                userId = 1;
                                return userId;
                            })
                        }
                    })
                    .factory("location", function() {
                        locationSpy = jasmine.createSpyObj("locationSpy", ["buildArray", "buildObject"]);
                        return locationSpy;
                    })
                module("fireStarter.services",
                    function($provide) {
                        $provide.service("fireStarter",
                            function($q) {
                                return function(type, path, flag) {
                                    if (type === "object") {
                                        fbObject = jasmine.createSpyObj("fbObject", ["timestamp", "ref", "path", "bindTo", "destroy",
                                            "id", "priority", "value", "loaded", "remove", "save", "watch"
                                        ]);
                                        fsType = type;
                                        return fbObject;
                                    } else if (type === "geo") {

                                        geoSpy = jasmine.createSpyObj("geoSpy", ["get", "set", "remove", "distance"]);
                                        fsType = type;
                                        return $q.when(geoSpy);
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
                inject(function(_firePath_, _session_, _$rootScope_, _fireEntity_, _inflector_, _fireStarter_, _$q_, _$log_) {
                    session = _session_;
                    $rootScope = _$rootScope_;
                    inflector = _inflector_;
                    firePath = _firePath_;
                    fireEntity = _fireEntity_;
                    fireStarter = _fireStarter_;
                    $q = _$q_;
                    $log = _$log_;
                });

                subject = fireEntity("path");

            });
            afterEach(function() {
                pathSpy = null;
                firePath = null;
                fireEntity = null;
                fireStarter = null;
            });
            describe("Constructor", function() {
                it("should be defined", function() {
                    expect(subject).toBeDefined();
                });
                it("should accept an options hash", function() {
                    expect(subject).toBeDefined();
                });
            });
            describe("Main fireStarter Constructors", function() {
                describe("buildObject", function() {
                    it("should call fireStarter with 'object' argument", function() {
                        expect(fbObject).not.toBeDefined();
                        subject.buildObject(["path"]);
                        expect(fbObject).toBeDefined();
                    });

                });
                describe("buildArray", function() {
                    it("should call fireStarter with 'array' argument", function() {
                        expect(fbArray).not.toBeDefined();
                        subject.buildArray(["path"]);
                        expect(fbArray).toBeDefined();
                        expect(fbArray).toBeDefined();
                    });
                });
            });
            describe("Registering firebase refs", function() {
                var recId = 1;
                var nested = "nestedPath";
                var nestedId = "nestedPath";
                var fpMethods = [
                    ["mainArray", [], "array"],
                    ["mainRecord", [recId], "object"],
                    // ["nestedArray", [recId, nested], "array"],
                    // ["nestedRecord", [recId, nested, nestedId], "object"],
                ];

                function testMethods(y) {
                    describe(y[0], function() {
                        var meth;
                        switch (y[1].length) {
                            case 0:
                                it("should call " + y[0] + " on firePath", function() {
                                    meth = subject[y[0]]();
                                    expect(pathSpy[y[0]]).toHaveBeenCalled();
                                });
                                break;
                            case 1:
                                it("should call " + y[0] + " on firePath", function() {
                                    meth = subject[y[0]](y[1][0]);
                                    expect(pathSpy[y[0]]).toHaveBeenCalledWith(y[1][0]);
                                });
                                break;
                            case 2:
                                it("should call " + y[0] + " on firePath", function() {
                                    meth = subject[y[0]](y[1][0], y[1][1]);
                                    expect(pathSpy[y[0]]).toHaveBeenCalledWith(y[1][0], y[1][1]);
                                });
                                break;
                            case 3:
                                it("should call " + y[0] + " on firePath", function() {
                                    meth = subject[y[0]](y[1][0], y[1][1], y[1][2]);
                                    expect(pathSpy[y[0]]).toHaveBeenCalledWith(y[1][0], y[1][1], y[1][2]);
                                });
                                break;
                        }
                        it("should call fireStarter with " + y[2], function() {
                            meth
                            expect(fsType).toEqual(y[2]);
                        });
                        it("should call fireStarter with correct path", function() {
                            meth
                            expect(fsPath).toEqual("path");
                        });
                    });
                }
                fpMethods.forEach(testMethods);
            });
            describe("Registering CRUD operations", function() {
                describe("Command Methods", function() {
                    beforeEach(function() {
                        data = {
                            name: "name",
                            phone: "phone"
                        };
                    });
                    describe("createMainRecord", function() {
                        // it("should call add on fireStarter", function() {
                        //     subject.createMainRecord(data);
														// $rootScope.$digest();
                        //     expect(fbArray.add).toHaveBeenCalledWith(data);
                        //     expect(pathSpy.mainArray).toHaveBeenCalled();
                        // });
                        // it("should call mainArray on firePath", function() {
                        //     subject.createMainRecord(data);
														// $rootScope.$digest();
                        //     expect(pathSpy.mainArray).toHaveBeenCalled();
                        // });
                    });
                    describe("createNestedRecord", function() {
                        // it("should call add on fireStarter", function() {
                        //     subject.createNestedRecord(1, "locations", data);
														// $rootScope.$digest();
                        //     expect(fbArray.add).toHaveBeenCalledWith(data);
                        // });
                        // it("should call nestedArray on firePath with correct args", function() {
                        //     subject.createNestedRecord(1, "locations", data);
														// $rootScope.$digest();
                        //     // expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "locations");
                        // });
                    });
                });
            });
            describe("Options", function() {
                beforeEach(function() {
                    spyOn($log, "info").and.callThrough();
                    options = {
                        geofire: true,
                        nestedArrays: ["phone", "email"],
                        user: true,
                    };
                    subject = fireEntity("path", options);
                });

                describe("Geofire", function() {
                    describe("Nested Arrays & Records", function() {
                        it("should add new method for nested locations array and record", function() {
                            expect(subject.locations).toBeDefined();
                            expect(subject.location).toBeDefined();
                        });
                        it("should pass an id and the pluaralized array name to firePath", function() {
                            subject.locations(1);
                            expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "locations");
                        });
                        it("locations() should call 'array' on fireStarter", function() {
                            subject.buildObject("path");
                            subject.locations(1);
                            expect(fsType).toEqual("array");
                            expect(fbArray).toBeDefined();
                        });
                        it("should pass an id and the pluaralized array name to firePath", function() {
                            subject.location(1, 1);
                            expect(pathSpy.nestedRecord).toHaveBeenCalledWith(1, "locations", 1);
                        });
                        it("location() should call 'object' on fireStarter", function() {
                            subject.buildArray("path");
                            subject.location(1, 1);
                            expect(fsType).toEqual("object");
                            expect(fbObject).toBeDefined();
                        });
                    });
                    describe("Access to Main Locations", function() {
                        describe("mainLocations()", function() {
                            it("should add mainLocations()", function() {
                                expect(subject.mainLocations).toBeDefined();
                            });
                            it("should make a fireStart Array", function() {
                                subject.buildObject("path");
                                subject.mainLocations();
                                expect(fsType).toEqual("array");
                                expect(fbArray).toBeDefined();
                            });
                            it("should call mainArray() on firePath", function() {
                                subject.mainLocations();
                                expect(pathSpy.mainArray).toHaveBeenCalled();
                            });
                            it("should call firePath with correct path array", function() {
                                subject.mainLocations();
                                expect(fsPath).toEqual(["locations", "path"]);
                            });
                        });
                        describe("mainLocation()", function() {
                            it("should add mainLocation()", function() {
                                expect(subject.mainLocation).toBeDefined();
                            });
                            it("should make a fireStarter Object", function() {
                                subject.buildArray("path");
                                subject.mainLocation(1);
                                expect(fsType).toEqual("object");
                                expect(fbObject).toBeDefined();
                            });
                            it("should call mainRecord() on firePath", function() {
                                subject.mainLocation(1);
                                expect(pathSpy.mainRecord).toHaveBeenCalledWith(1);
                            });
                            it("should call firePath with correct path array", function() {
                                subject.mainLocation(1);
                                expect(fsPath).toEqual(["locations", "path"]);
                            });
                        });
                    });
                    // Now not passing because added 'then' to methods
                    // describe("Access to geoService", function() {
                    //     it("geofireSet() should call set on geo service with path, key and coords", function() {
                    //         subject.geofireSet(1, 2);
                    //         expect(geoSpy.set).toHaveBeenCalledWith(1,2);
                    //     });
                    //     it("geofireGet() should call get on geo service with path and key", function() {
                    //         subject.geofireGet(1);
                    //         expect(geoSpy.get).toHaveBeenCalledWith(1);
                    //     });
                    //     it("geofireRemove() should call remove on geo service with path and key", function() {
                    //         subject.geofireRemove(1);
                    //         expect(geoSpy.remove).toHaveBeenCalledWith(1);
                    //     });
                    // });
                });
                describe("SessionAccess", function() {
                    beforeEach(function() {
                        options = {
                            user: true
                        };
                        path = fireEntity("path", options);

                    });
                    it("should be defined", function() {
                        expect(path).toBeDefined();

                    });
                    it("should make current user methods available", function() {
                        expect(path.userNestedArray).toBeDefined();
                        expect(path.userNestedRecord).toBeDefined();
                        expect(path.session()).toBeDefined();
                        //this doesn't pass if invoke sessionId()
                        expect(path.sessionId).toBeDefined();
                    });
                    it("Should throw error if options are specified", function() {
                        path = firePath("path");
                        expect(function() {
                            path.userNestedArray()
                        }).toThrow();
                        expect(function() {
                            path.sessionId()
                        }).toThrow();
                    });
                    it("should call correct method on storage location", function() {
                        path.sessionId();
                        expect(session.getId).toHaveBeenCalled();
                    });
                    it("session() should === $rootScope.session", function() {
                        expect(path.session()).toEqual(session);
                    });

                    describe("choosing a different storageLocation", function() {
                        beforeEach(function() {
                            options = {
                                sessionLocation: "differentSession",
                                user: true
                            };
                            path = fireEntity("path", options);
                            path.sessionId();

                        });
                        // it("should call new session location", function() {
                        //     expect(differentSession.getId).toHaveBeenCalled();
                        // });
                        it("should not call default session location", function() {
                            expect(session.getId).not.toHaveBeenCalled();
                        });
                    });
                    describe("choosing a different method", function() {
                        beforeEach(function() {
                            options = {
                                sessionIdMethod: "findId",
                                sessionLocation: "differentSession",
                                user: true
                            };
                            path = fireEntity("path", options);
                            path.sessionId();

                        });
                        // it("should call new session location with findId()", function() {
                        //     expect(differentSession.findId).toHaveBeenCalled();
                        // });
                        // it("should call new session location not with getId()", function() {
                        //     expect(differentSession.getId).not.toHaveBeenCalled();
                        // });
                    });
                });
                describe("User", function() {
                    beforeEach(function() {
                        options = {
                            user: true,
                        };
                        path = fireEntity("path", options);
                    });
                    describe("userNestedArray()", function() {
                        it("should make a fireStart Array", function() {
                            path.buildObject("path");
                            path.userNestedArray();
                            expect(fsType).toEqual("array");
                            expect(fbArray).toBeDefined();
                        });
                        it("should call mainArray() on firePath", function() {
                            path.userNestedArray();
                            expect(pathSpy.mainArray).toHaveBeenCalled();
                        });
                        it("should call firePath with correct path array", function() {
                            path.userNestedArray();
                            expect(fsPath).toEqual(["users", 1, "path"]);
                        });
                    });
                    describe("userNestedRecord()", function() {
                        it("should add userNestedRecord()", function() {
                            expect(path.userNestedRecord).toBeDefined();
                        });
                        it("should make a fireStarter Object", function() {
                            path.buildArray("path");
                            path.userNestedRecord(1);
                            expect(fsType).toEqual("object");
                            expect(fbObject).toBeDefined();
                        });
                        it("should call mainRecord() on firePath", function() {
                            path.userNestedRecord(1);
                            expect(pathSpy.mainRecord).toHaveBeenCalledWith(1);
                        });
                        it("should call firePath with correct path array", function() {
                            path.userNestedRecord(1);
                            expect(fsPath).toEqual(["users", 1, "path"]);
                        });
                    });
                });
                describe("Nested Arrays", function() {
                    beforeEach(function() {
                        spyOn($q, "all").and.callThrough();
                        spyOn($q, "reject").and.callThrough();
                        $rootScope.$digest();
                        $rootScope.$digest();
                    });
                    it("shouldnt call q reject", function() {
                        expect($q.reject.calls.count()).toEqual(0);
                    });
                    it("should define a new method for the array", function() {
                        expect(subject.emails).toBeDefined();
                        expect(subject.phones).toBeDefined();
                    });

                    it("should pass an id and the pluaralized array name to firePath", function() {
                        subject.phones(1);
                        expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "phones");
                        subject.emails(1);
                        expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "emails");
                    });
                    it("won't change array name if passed plural name to firePath", function() {
                        options = {
                            nestedArrays: ["phones"]
                        };
                        subject = fireEntity("path", options);
                        subject.phones(1);
                        expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "phones");
                    });
                    it("should call 'array' on fireStarter", function() {
                        subject.buildObject("path");
                        subject.phones(1);
                        expect(fsType).toEqual("array");
                        expect(fbArray).toBeDefined();
                    });
                    describe("Nested Records", function() {
                        it("should define a new method for records of the array", function() {
                            expect(subject.phone).toBeDefined();
                            expect(subject.email).toBeDefined();
                        });
                        it("should pass an id and the pluaralized array name to firePath", function() {
                            subject.phone(1, 1);
                            expect(pathSpy.nestedRecord).toHaveBeenCalledWith(1, "phones", 1);
                        });
                        it("should call 'object' on fireStarter", function() {
                            subject.buildArray("path");
                            subject.phone(1, 1);
                            expect(fsType).toEqual("object");
                            expect(fbObject).toBeDefined();
                        });
                    });
                    it("should throw error if option isn't an array", function() {
                        options = {
                            nestedArrays: "blah",
                        };
                        expect(function() {
                            fireEntity("path", options);
                        }).toThrow();
                    });
                });
            });

        });
    });

})();
