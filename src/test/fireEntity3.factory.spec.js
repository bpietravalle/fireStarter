(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        describe("with firePath mock", function() {
            var firePath, lastRecs, recRemoved, copy, keys, testutils, root, success, failure, recAdded, sessionSpy, locData, userId, maSpy, maSpy1, mrSpy, naSpy, nrSpy, fsMocks, geo, test, ref, objRef, objCount, arrCount, arrRef, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;


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

                spyOn($q, "reject").and.callThrough();
                spyOn($log, "info").and.callThrough();
            });
            describe("Geofire", function() {
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
                                recAdded.push([snap.ref().parent().key(), snap.ref().key()]);
                                if (snap.hasChildren()) {
                                    snap.ref().on("child_added", function(s) {
                                        if (s.hasChildren()) {
                                            s.ref().on("value", function(v) {
                                                recAdded.push([s.ref().key(), v.val()]);
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
                });
                // describe("trackLocations", function() {
                // it("should add two records to mainLocations Array", function() {
                //     expect(recAdded[1][1]).toEqual(jasmine.objectContaining({
                //         place_id: "string",
                //         placeType: "a place",
                //         distance: 1234,
                //         closeBy: true
                //     }));
                //     expect(recAdded[2][1]).toEqual(jasmine.objectContaining({
                //         place_id: "different_place",
                //         placeType: "some place",
                //         distance: 1000,
                //         closeBy: null
                //     }));
                // });
                // it("should remove the coordinate data from mainLocation array", function() {
                //     var coords = ["lat", "lon"];

                //     function checkCoords(y) {
                //         expect(recAdded[1][1][y[1]]).not.toBeDefined();
                //         expect(recAdded[2][1][y[1]]).not.toBeDefined();
                //     }
                //     coords.forEach(checkCoords);

                // });
                // it("should add mainArrayKey to data object", function() {
                //     expect(recAdded[1][1].mainArrayKey).toEqual("mainRecKey");
                //     expect(recAdded[2][1].mainArrayKey).toEqual("mainRecKey");
                // });
                // it("should save 2 records to geofire", function() {
                //     expect(recAdded[4][1]).toEqual(jasmine.objectContaining({
                //         g: jasmine.any(String),
                //         l: [45, 100]
                //     }));
                //     expect(recAdded[5][1]).toEqual(jasmine.objectContaining({
                //         g: jasmine.any(String),
                //         l: [90, 100]
                //     }));
                // });
                // it("should set geofire key to mainLocation key", function() {
                //     expect(recAdded[1][0]).toEqual(recAdded[5][0]);
                //     expect(recAdded[2][0]).toEqual(recAdded[4][0]);
                // });

                // });
                // describe("untrackLocations", function() {
                // beforeEach(function() {
                //     this.rec1 = recAdded[1][0];
                //     this.rec2 = recAdded[2][0];
                //     recRemoved = [];
                //     ref.on("child_changed", function(shot) {
                //         shot.ref().on("child_removed", function(snap) {
                //             // if (snap.hasChildren()) {
                //             snap.ref().on("child_changed", function(s) {
                //                 // if (s.hasChildren()) {
                //                 s.ref().on("value", function(v) {
                //                     recRemoved.push([s.ref().key(), v.val()]);
                //                 });
                //                 // }
                //             });
                //             // }
                //         });
                //     });
                //     subject.untrackLocations([this.rec1, this.rec2]);
                //     // $rootScope.$digest();
                //     // ref.flush();
                //     // $rootScope.$digest();
                // });
                // afterEach(function() {
                //     lastRecs = recAdded;
                //     recAdded = null;
                //     recRemoved = null;
                // });
                // it("should work", function() {
                //     expect(recAdded[1][0]).toEqual(this.rec1);
                //     expect(recAdded[2][0]).toEqual(this.rec2);
                //     // expect(recRemoved).toEqual("as");
                // });
                // describe("recAdded", function() {
                //     it("mainLoc key #1", function() {
                //         expect(recAdded[1][0]).toEqual(1);
                //     });
                //     it("mainLoc key #2", function() {
                //         expect(recAdded[2][0]).toEqual(2);
                //     });
                //     it("geofire key #2", function() {
                //         expect(recAdded[4]).toEqual(4);
                //     });
                //     it("geofire key #1", function() {
                //         expect(recAdded[5]).toEqual(5);
                //     });
                // });
                // describe("lastRecs", function() {
                //     it("mainLoc key #1", function() {
                //         expect(lastRecs[1][0]).toEqual(1);
                //     });
                //     it("mainLoc key #2", function() {
                //         expect(lastRecs[2][0]).toEqual(2);
                //     });
                //     it("geofire key #2", function() {
                //         expect(lastRecs[4]).toEqual(4);
                //     });
                //     it("geofire key #1", function() {
                //         expect(lastRecs[5]).toEqual(5);
                //     });
                // });


                // it("should not call $q.reject", function() {
                //     expect($q.reject.calls.argsFor(0)).toEqual(0);
                // });
                // it("should not call $q.reject", function() {
                //     expect($q.reject.calls.argsFor(1)).toEqual(1);
                // });
                // it("should not call $q.reject", function() {
                //     expect($q.reject.calls.argsFor(2)).toEqual(2);
                // });


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
                // jjk

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

        function testInspect(x) {
            expect(x).toEqual("test");
        }

        function deferredValue(obj) {
            return obj.$$state.pending[0][0].promise.$$state.value; //.value;
        }


    });

})();
