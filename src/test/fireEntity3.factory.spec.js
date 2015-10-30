(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        describe("with firePath mock", function() {
            var firePath, recRemoved, copy, keys, testutils, root, success, failure, recAdded, sessionSpy, locData, userId, maSpy, maSpy1, mrSpy, naSpy, nrSpy, fsMocks, geo, test, ref, objRef, objCount, arrCount, arrRef, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;


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
                    .factory("sessionSpy", function() {
                        sessionSpy = jasmine.createSpyObj("sessionSpy", ["getId", "findId"]);
                        return sessionSpy;
                    })
                module("testutils");
                module("fireStarter.services");

                inject(function(_testutils_, _$log_, _firePath_, _sessionSpy_, _$rootScope_, _fireEntity_, _inflector_, _fireStarter_, _$q_) {
                    testutils = _testutils_;
                    sessionSpy = _sessionSpy_;
                    $rootScope = _$rootScope_;
                    inflector = _inflector_;
                    firePath = _firePath_;
                    fireEntity = _fireEntity_;
                    fireStarter = _fireStarter_;
                    $q = _$q_;
                    $log = _$log_;
                    $rootScope.session = {
                        getId: jasmine.createSpy("getId").and.callFake(function() {
                            userId = 1;
                            return userId;
                        })
                    };
                });

                options = {
                    pathFlag: true,
                    mockRef: ref,
                    user: true,
                    geofire: true
                };
                spyOn($log, "info").and.callThrough();
            });
            describe("User/Main combo methods", function() {
                describe("Geofire", function() {
                    describe("trackLocations", function() {
                        beforeEach(function() {
                            ref = testutils.ref();
                            options = {
                                pathFlag: true,
                                mockRef: ref,
                                user: true,
                                geofire: true
                            };
                            subject = fireEntity("trips", options);
                            recAdded = [];
                            keys = [];
                            ref.on("child_added", function(shot) {
                                if (shot.hasChildren()) {
                                    shot.ref().on("child_added", function(snap) {
                                        recAdded.push([snap.ref().parent().key(),snap.ref().key()]);
                                        if (snap.hasChildren()) {
                                            snap.ref().on("child_added", function(s) {
                                                if (s.hasChildren()) {
                                                    s.ref().on("value", function(v) {
                                                        recAdded.push([s.ref().key(),v.val()]);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            subject.trackLocations(locData, "mainRecKey");
                            $rootScope.$digest();
                            ref.flush();
                            $rootScope.$digest();
                            ref.flush();
                        });
                        afterEach(function() {
                            ref = null;
                            recAdded = null;
                            keys = null;
                        });

                        it("should add two records to mainLocations Array", function() {
                            expect(recAdded.length).toEqual(2);
                            expect(recAdded).toEqual("recAdded");
                            // expect(keys).toEqual("keys");
                            // expect($log.info.calls.allArgs()).toEqual("as");
                            // expect($log.info.calls.count()).toEqual(5);
                            // expect(recAdded[0]).toEqual(jasmine.objectContaining({
                            //     place_id: "string",
                            //     placeType: "a place",
                            //     distance: 1234,
                            //     closeBy: true
                            // }));
                            // expect(recAdded[1]).toEqual(jasmine.objectContaining({
                            //     place_id: "different_place",
                            //     placeType: "some place",
                            //     distance: 1000,
                            //     closeBy: null
                            // }));
                        });
                        it("should remove the coordinate data from mainLocation array", function() {
                            // var coords = [
                            //     [0, "lat"],
                            //     [0, "lon"],
                            //     [1, "lat"],
                            //     [1, "lon"]
                            // ];

                            // function checkCoords(y) {
                            //     expect(recAdded[y[0]][y[1]]).not.toBeDefined();
                            // }
                            // coords.forEach(checkCoords);

                        });
                        it("should add mainArrayKey to data object", function() {
                            // expect(recAdded[0].mainArrayKey).toEqual("mainRecKey");
                            // expect(recAdded[1].mainArrayKey).toEqual("mainRecKey");
                        });
                        it("should save 2 records to geofire", function() {
                            // $rootScope.$digest();
                            // ref.flush();
                            // expect(recAdded[0]).toEqual(jasmine.objectContaining({
                            //     $id: jasmine.any(String),
                            //     $priority: jasmine.any(String),
                            //     g: jasmine.any(String),
                            //     l: {
                            //         0: jasmine.any(Number),
                            //         1: jasmine.any(Number)
                            //     }
                            // }));
                            // expect(recAdded[1]).toEqual(jasmine.objectContaining({
                            //     $id: jasmine.any(String),
                            //     $priority: jasmine.any(String),
                            //     g: jasmine.any(String),
                            //     l: {
                            //         0: jasmine.any(Number),
                            //         1: jasmine.any(Number)
                            //     }
                            // }));
                        });
                        it("should set geofire key to mainLocation key", function() {
                            // expect(recAdded[0].$priority).toEqual(null);
                            // expect(recAdded[1].$priority).toEqual(null);
                            // var mainArrKey1 = keys[0];
                            // var mainArrKey2 = keys[1];
                            // $rootScope.$digest();
                            // ref.flush();
                            // expect(recAdded[0].$id).toEqual(mainArrKey1);
                            // expect(recAdded[1].$id).toEqual(mainArrKey2);
                            // expect(recAdded[0].$priority).toEqual(jasmine.any(String));
                            // expect(recAdded[1].$priority).toEqual(jasmine.any(String));
                        });

                    });
                    describe("untrackLocations", function() {
                        beforeEach(function() {
                            this.exists = 0;
                            this.newRef = 0;
                            ref = testutils.ref();
                            // if (ref === null) {
                            //     this.newRef++;
                            // ref = testutils.ref("locations/trips");
                            ref.on("child_added", function(snap) {
                                recAdded.push(snap.val());
                                keys.push([snap.ref().key(), snap.ref().path]);
                            });
                            // } else {
                            //     this.exists++;
                            //     ref = testutils.ref("geofire/trips");
                            //     ref.on("child_added", function(snap) {
                            //         recAdded.push(snap.val());
                            //         keys.push([snap.ref().key(), snap.ref().path]);
                            //     });
                            // }
                            options = {
                                pathFlag: true,
                                mockRef: ref,
                                user: true,
                                geofire: true
                            };
                            subject = fireEntity("trips", options);
                            // ref.on("child_added", function(snap) {
                            //     recAdded.push(snap.val());
                            //     keys.push([snap.ref().key(),snap.ref().path]);
                            // });
                            test = subject.trackLocations(locData, "mainRecKey");
                            $rootScope.$digest();
                            ref.flush();
                            $rootScope.$digest();
                            ref.flush();
                            // subject.trackLocations(locData, "mainRecKey");
                        });
                        afterEach(function() {
                            ref = null;
                            recAdded = [];
                            keys = [];
                        });

                        // it("exist = 1", function() {
                        // });
                        // it("newRef = 1", function() {
                        //     expect(recAdded[0]).toEqual(1);
                        // });
                        // it("should work", function() {
                        //     expect(recAdded).toEqual("recAdded");
                        // });
                        // it("should work", function() {
                        //     expect(keys).toEqual("keys");
                        // });
                        // it("should remove record of each record provided", function() {
                        // expect(recAdded).toEqual("as");
                        // expect(keys).toEqual("as");
                        // expect(ref.child("locations/trips").ref()).toEqual(2);
                        //     expect(subject.locations("string").base().length).toEqual(2);
                        //     var rec = subject.locations("string").base()[0];
                        //     subject.untrackLocations([rec]);
                        //     $rootScope.$digest();
                        //     $rootScope.$digest();
                        //     arrMock.$ref().flush();
                        //     $rootScope.$digest();
                        //     expect(subject.locations("string").base().length).toEqual(1);
                        // });
                        // it("should remove record if only provide key instead", function() {
                        //     expect(subject.locations("string").base().length).toEqual(2);
                        //     var rec = subject.locations("string").base()[0].$id;
                        //     subject.untrackLocations([rec]);
                        //     $rootScope.$digest();
                        //     $rootScope.$digest();
                        //     arrMock.$ref().flush();
                        //     $rootScope.$digest();
                        //     expect(subject.locations("string").base().length).toEqual(1);
                        // });
                        // it("should call geofire service correct number of times with correct args", function() {
                        //     var rec = subject.locations("string").base()[0];
                        //     subject.untrackLocations([rec]);
                        //     $rootScope.$digest();
                        //     $rootScope.$digest();
                        //     arrMock.$ref().flush();
                        //     $rootScope.$digest();
                        //     expect(maSpy.remove.calls.count()).toEqual(1);
                        //     expect(maSpy.remove.calls.argsFor(0)[0]).toEqual("requests");
                        //     expect(maSpy.remove.calls.argsFor(0)[1]).toEqual(rec.$id);
                        // });

                    });
                });
                describe("createUserAndMain", function() {
                    beforeEach(function() {
                        var main = {
                                time: "today",
                                duration: 1,
                                outside: true
                            }
                            // test = subject.createUserAndMain(main);
                        $rootScope.$digest();
                    });

                    it("should call the main Array", function() {
                        // expect(pathSpy.mainArray).toHaveBeenCalled();
                        // expect(maSpy).toEqual("as");
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

        function deferredValue(obj) {
            return obj.$$state.pending[0][0].promise.$$state.value; //.value;
        }
    });



})();
