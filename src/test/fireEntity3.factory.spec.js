(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        var firePath, session, lastRecs, recRemoved, copy, keys, testutils, root, success, failure, recAdded, sessionSpy, locData, userId, maSpy, maSpy1, mrSpy, naSpy, nrSpy, fsMocks, geo, test, ref, objRef, objCount, arrCount, arrRef, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;


        beforeEach(function() {
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
                closeBy: null //false doesn't work
            }];
            angular.module("fireStarter.services")
                .factory("session", function() {
                    return {
                        getId: jasmine.createSpy("getId").and.callFake(function() {
                            userId = 1;
                            return userId;
                        })
                    }
                });
            module("testutils");
            module("fireStarter.services");

            inject(function(_testutils_, _$log_, _firePath_, _session_, _$rootScope_, _fireEntity_, _inflector_, _fireStarter_, _$q_) {
                testutils = _testutils_;
                session = _session_;
                $rootScope = _$rootScope_;
                inflector = _inflector_;
                firePath = _firePath_;
                fireEntity = _fireEntity_;
                fireStarter = _fireStarter_;
                $q = _$q_;
                $log = _$log_;
            });

            spyOn($q, "reject").and.callThrough();
            spyOn($log, "info").and.callThrough();
            options = {
                user: true,
                geofire: true
            };
            subject = fireEntity("trips", options);
        });
        afterEach(function() {
            subject = null;
            fireStarter = null;
            firePath = null;
        });

        describe("fireBaseRef Mngt", function() {
            describe("currentFirebase", function() {
                it("should be undefined on intialization", function() {
                    expect(subject.currentBase()).toBeUndefined();
                });
                it("should be defined after executing a method and digest cycle rotates", function() {
                    expect(subject.currentBase()).toBeUndefined();
                    subject.createMainRecord("data");
                    expect(subject.currentBase()).toBeUndefined();
                    $rootScope.$digest();
                    expect(subject.currentBase()).toBeDefined();
                });
                it("should change after successfull command", function() {
                    subject.createMainRecord("data");
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).not.toEqual(base2);
                });
                it("should change after successful queries that result in an array", function() {
                    subject.loadMainArray();
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).not.toEqual(base2);
                });
                it("should change after successful queries that result in an object", function() {
                    subject.createMainRecord("data");
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    var key = subject.currentRef().key();
                    subject.loadMainRecord(key);
                    var base1 = subject.currentBase();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).not.toEqual(base2);
                });
                it("should not change currentBase if command fails", function() {
                    subject.removeMainRecord("data");
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).toEqual(base2);
                });
                it("should not change currentBase if query fails", function() {
                    subject.mainRecord("data");
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).toEqual(base2);
                });
                it("should correctly set currentBase if command results in array", function() {
                    subject.trackLocations(locData, "mainRecKey");
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    // expect(base1).toEqual("as");
                    // expect($log.info.calls.argsFor()[0][1]).toEqual("as");
                    // expect($log.info.calls.allArgs()).toEqual(2);

                });


            });
            describe("currentRef", function() {
                it("should be undefined on intialization", function() {
                    expect(subject.currentRef()).toBeUndefined();
                });
                it("should be defined after executing a method and digest cycle rotates", function() {
                    expect(subject.currentRef()).toBeUndefined();
                    subject.createMainRecord("data");
                    expect(subject.currentRef()).toBeUndefined();
                    $rootScope.$digest();
                    expect(subject.currentRef()).toBeDefined();
                });
                it("should be equal to the ref() of the currentFirebase", function() {
                    subject.createMainRecord("data");
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    expect(subject.currentRef()).toEqual(subject.currentBase().ref());
                });

                it("should correctly assign ref of firebaseArrays", function() {
                    subject.loadMainArray();
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    expect(subject.currentRef()).toEqual(subject.currentBase().$ref());
                });
            });
            describe("currentPath", function() {
                it("should be undefined on intialization", function() {
                    expect(subject.currentPath()).toBeUndefined();
                });
                it("should be defined after executing a method and promise resolves", function() {
                    expect(subject.currentPath()).toBeUndefined();
                    subject.createMainRecord("data");
                    expect(subject.currentPath()).toBeUndefined();
                    $rootScope.$digest();
                    expect(subject.currentPath()).toBeDefined();
                });
                it("should be equal to the path of the currentRef", function() {
                    subject.createMainRecord("data");
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    expect(subject.currentPath()).toEqual(subject.currentRef().path);
                });
            });
            describe("pathHistory", function() {
                it("should be an empty array on intialization", function() {
                    expect(subject.pathHistory()).toBeEmpty
                    expect(subject.pathHistory()).toEqual([]);
                });
                it("should be defined after executing 2nd  method and promise resolves", function() {
                    subject.createMainRecord("data");
                    $rootScope.$digest();
                    var path1 = subject.currentPath();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    subject.createMainRecord("data");
                    var path2 = subject.currentPath();
                    expect(subject.pathHistory().length).toEqual(1);
                    expect(subject.pathHistory()[0]).toEqual(path1);
                    $rootScope.$digest();
                    expect(subject.pathHistory().length).toEqual(2);
                    expect(subject.pathHistory()[1]).toEqual(path2);
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    expect(subject.currentRef().path).toEqual(subject.currentPath());
                    expect(subject.pathHistory().length).toEqual(3);
                });

            });
        });
        describe("Simple Commands", function() {
            describe("createMainRecord", function() {});
            describe("removeMainRecord", function() {});
            describe("createNestedRecord", function() {});
            describe("removeNestedRecord", function() {});
            describe("Geofire", function() {
                describe("geofireSet", function() {});
                describe("geofireRemove", function() {});
                describe("createLocationRecord", function() {});
                describe("createNestedLocationRecord", function() {});
                describe("removeLocationRecord", function() {});
                describe("removeNestedLocationRecord", function() {});
            });
            describe("User", function() {
                describe("createUserRecord", function() {});
                describe("removeUserRecord", function() {});
            });

        });
        describe("Simple Queries", function() {
					describe("loadMainArray",function(){
					});
					describe("loadMainRecord",function(){
					});
					describe("loadNestedArray",function(){
						//this should be use the built in method
					});
					describe("loadNestedRecord",function(){
					});
            describe("Geofire", function() {
                describe("geofireGet", function() {});
                describe("loadLocationRecord", function() {});
                describe("loadNestedLocationRecord", function() {});
                describe("MainLocations", function() {});
                describe("MainLocation", function() {});
            });
            describe("User", function() {
                describe("loadUserRecords", function() {});
            });

        });
        describe("Complex Commands", function() {
            describe("Geofire", function() {
                describe("trackLocation", function() {
                });
                describe("untrackLocation", function() {
                });
                describe("trackLocations", function() {
                });
                describe("untrackLocations", function() {
                });
            });
        });
        describe("Complex Queries", function() {
					describe("loadMainFromUser",function(){

					});
				
				});

        function wrapPromise(p) {
            return p.then(success, failure);
        }

        function arrCount(arr) {
            return arr.base().ref().length;
        }

        function getBaseResult(obj) {
            return obj.base().ref()['data'];
        }

        function getRefData(obj) {
            return obj.ref()['data'];
        }

        function getPromValue(obj) {
            return obj.$$state.value;
        }

        function getDeferred(obj) {
            return obj.$$state.pending[0][0];
        }

        function promiseStatus(obj) {
            return obj.$$state.status;
        }

        function deferredStatus(obj) {
            return obj.$$state.pending[0][0].promise.$$state.status;
        }

        function resolveDeferred(obj, cb) {
            return obj.$$state.pending[0][0].resolve(cb);
        }

        function setChild(ref, path) {
            return ref.child(path);
        }

        function rejectDeferred(obj, cb) {
            return obj.$$state.pending[0][0].reject(cb);
        }

        function testInspect(x) {
            expect(x).toEqual("test");
        }

        function deferredValue(obj) {
            return obj.$$state.pending[0][0].promise.$$state.value; //.value;
        }


    });


})();
