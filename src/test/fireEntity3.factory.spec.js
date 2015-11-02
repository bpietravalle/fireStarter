(function() {


    "use strict";

    describe("FireEntity Factory", function() {
        describe("with firePath mock", function() {
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
                ref = subject.preActionRef();
            });
            afterEach(function() {
                subject = null;
                fireStarter = null;
                firePath = null;
            });

            describe("fireBaseRef Mngt", function() {

                describe("preActionRef", function() {
                    it("should be undefined on intialization", function() {
                        expect(subject.preActionRef()).toBeUndefined();
                    });
                    it("should be defined after executing a method and digest cycle rotates", function() {
                        expect(subject.preActionRef()).toBeUndefined();
                        subject.createMainRecord("data");
                        expect(subject.preActionRef()).toBeUndefined();
                        $rootScope.$digest();
                        expect(subject.preActionRef()).toBeDefined();
                    });
                });
                describe("preActionRefHistory", function() {
                    beforeEach(function() {
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                    });
                    it("should be an empty array on initization", function() {
                        expect(subject.preActionRefHistory()).toBeEmpty();
                        expect(subject.preActionRefHistory()).toEqual([]);
                    });
                    it("should be defined after 2nd method is executed and digest cycle rotates", function() {
                        expect(subject.preActionRefHistory()).toBeEmpty();
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                        // expect(subject.preActionRefHistory()).not.toBeEmpty();
                        // expect(subject.preActionRefHistory().length).toEqual(1);
                    });
                    it("should store path of previous refs", function() {
                        var path = subject.preActionRef().path;
                        subject.mainLocations();
                        $rootScope.$digest();
                        expect(subject.preActionRefHistory()[0]).toEqual(path);
                        expect(subject.preActionRef().path).not.toEqual(path);
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
                    it("should be equal to preActionRef before any method finishes executing on firebase", function() {
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                        expect(subject.currentRef()).toEqual(subject.preActionRef());
                    });
                    it("should be equal to postActionRef after any command method finishes executing on firebase", function() {
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        expect(subject.currentRef()).toEqual(subject.postActionRef());
                    });

                });
                describe("postActionRef", function() {
                    it("should be undefined on intialization", function() {
                        expect(subject.postActionRef()).toBeUndefined();
                    });
                    it("should be defined after executing a method, digest cycle rotates, and you flush currentRef", function() {
                        expect(subject.postActionRef()).toBeUndefined();
                        subject.createMainRecord("data");
                        expect(subject.postActionRef()).toBeUndefined();
                        expect(subject.currentRef()).toBeUndefined();
                        $rootScope.$digest();
                        expect(subject.currentRef()).toBeDefined();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        expect(subject.postActionRef()).toBeDefined();
                    });
                });
                describe("postActionRefHistory", function() {
                    beforeEach(function() {
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                    });
                    it("should be an empty array on initization", function() {
                        expect(subject.postActionRefHistory()).toBeEmpty();
                        expect(subject.postActionRefHistory()).toEqual([]);
                    });
                    it("should be defined after 3rd method is executed, digest cycle rotates, and you flush currentRef", function() {
                        expect(subject.postActionRefHistory()).toBeEmpty();
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                        subject.currentRef().flush()
                        $rootScope.$digest();
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                        subject.currentRef().flush()
                        $rootScope.$digest();
                        expect(subject.postActionRefHistory()).not.toBeEmpty();
												//this was 1 before added checkCurrentRef method
                        expect(subject.postActionRefHistory().length).toEqual(2);
                    });
                    it("should store path of previous refs", function() {
                        subject.createMainRecord("data");
                        $rootScope.$digest();
                        subject.currentRef().flush()
                        $rootScope.$digest();
                        subject.createMainRecord("data");
                        var path = subject.postActionRef().path;
                        $rootScope.$digest();
                        subject.currentRef().flush()
                        $rootScope.$digest();
												//this was item [0] before added checkCurrentRef method
                        expect(subject.postActionRefHistory()[1]).toEqual(path);
                        expect(path).toEqual(jasmine.any(String));
                        expect(subject.postActionRef().path).not.toEqual(path);
                    });
                });
            });
            describe("Geofire", function() {
                describe("trackLocation", function() {
                    beforeEach(function() {
                        recAdded = [];
                        keys = [];
                        // ref.on("child_added", function(shot) {
                        //     if (shot.hasChildren()) {
                        //         shot.ref().on("child_added", function(snap) {
                        //             recAdded.push([snap.ref().parent().key(), snap.ref().key()]);
                        //             if (snap.hasChildren()) {
                        //                 snap.ref().on("child_added", function(s) {
                        //                     if (s.hasChildren()) {
                        //                         s.ref().on("value", function(v) {
                        //                             recAdded.push([s.ref().key(), v.val()]);
                        //                             keys.push(s.ref().key());
                        //                         });
                        //                     }
                        //                 });
                        //             }
                        //         });
                        //     }
                        // });
                        subject.trackLocations(locData, "mainRecKey");
                        $rootScope.$digest();
                        // ref.flush();
                        $rootScope.$digest();
                        // ref.flush();
                        $rootScope.$digest();
                    });
                    afterEach(function() {
                        lastRecs = keys;
                        subject = null;
                        recAdded = null;
                        keys = null;
                        ref = null;
                    });
                    // it("should add two records to mainLocations Array", function() {

                    //     expect(recAdded[1][1]).toEqual(jasmine.objectContaining({
                    //         place_id: "string",
                    //         placeType: "a place",
                    //         lat: 90,
                    //         lon: 100,
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
                    // it("should save a record to geofire", function() {
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
                    it("should call log", function() {
                        var test1 = subject.mainLocations();
                        // var test = subject.mainLocation(keys[0]);
                        // var test2 = ref.child("locations/trips").child(keys[0]);
                        // var test3 = ref.child("locations/trips");
                        // var test = subject.mainLocations(keys[0]);
                        $rootScope.$digest();
                        // expect(getRefData(getPromValue(test))).toEqual(recAdded[1][1]);
                        // expect(keys[0]).toEqual(recAdded[1][0]);
                        // expect(keys[1]).toEqual(recAdded[2][0]);
                        // expect(keys[0]).toEqual("key 1");
                        // var t1 = subject.getIndex(test1, keys[0]);
                        $rootScope.$digest();
                        // $rootScope.$digest();
                        $rootScope.$digest();
                        // expect(t1).toEqual("index");
                        // expect(test2['data']).toEqual(recAdded[1][1]);
                        // expect(getRefData(getPromValue(t1))).toEqual("as");
                        // expect(getRefData(getPromValue(test1))).toEqual(getRefData(test3));
                        // expect(subject.preActionRef()).toEqual("as");
                        // expect($q.reject.calls.allArgs()).toEqual("errors");

                        // expect(keys).toEqual("new");
                        // expect(lastRecs).toEqual("last");
                        // expect($log.info.calls.allArgs()).toEqual("as");
                    });
                });
                describe("untrackLocations", function() {
                    beforeEach(function() {

                        recRemoved = [];
                        // ref.on("child_changed", function(shot) {
                        //     shot.ref().on("child_removed", function(snap) {
                        //         snap.ref().on("child_changed", function(s) {
                        //             s.ref().on("value", function(v) {
                        //                 recRemoved.push([s.ref().key(), v.val()]);
                        //             });
                        //         });
                        //     });
                        // });
                    });

                    it("should work", function() {
                        // $rootScope.$digest();
                        // test = subject.mainLocations()
                        // $rootScope.$digest();
                        // expect(test.ref().base().length).toEqual(1);
                        // expect(test.ref()['data']).toEqual(0);
                        // subject.createLocationRecord(locData[0]);
                        // $rootScope.$digest();
                        // ref.flush();
                        // $rootScope.$digest();
                        // expect(test.base().length).toEqual(1);
                        // expect(test[0].id).toEqual(recAdded[1][0]);
                        // subject.untrackLocation(recAdded[1][0]);
                        // $rootScope.$digest();
                        // ref.flush();
                        // $rootScope.$digest();
                        // expect(test.length).toEqual(0);
                    });

                    it("should not call $q.reject", function() {
                        // expect($q.reject.calls.count()).toEqual(0);
                    });
                    it("should not call $q.reject", function() {
                        // expect($q.reject.calls.argsFor(0)).toEqual(1);
                    });
                    // it("should not call $q.reject", function() {
                    //     expect($q.reject.calls.argsFor(2)).toEqual(2);
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
