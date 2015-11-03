(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        var firePath, arrData, newData, newRecord, test1, session, lastRecs, recRemoved, copy, keys, testutils, root, success, failure, recAdded, sessionSpy, locData, userId, maSpy, maSpy1, mrSpy, naSpy, nrSpy, fsMocks, geo, test, ref, objRef, objCount, arrCount, arrRef, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;


        beforeEach(function() {
            arrData = [{
                phone: "123456890",
                firstName: "tom"
            }, {
                phone: "0987654321",
                firstName: "frank"
            }];

            newData = {
                phone: "111222333",
                key: function() {
                    return "key";
                },
                firstName: "sally"
            };

            newRecord = {
                phone: "111222333",
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
                //Still a problem
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
            describe("createMainRecord", function() {
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
                            test = subject.createMainRecord(data, null, true);
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should add uid property to record", function() {
                            expect(getPromValue(test, true).uid).toBeDefined();
                            expect(getPromValue(test, true)).toBeDefined();
                        });
                    });
                    describe("if undefined", function() {
                        beforeEach(function() {
                            var data = {
                                rec: newRecord,
                                geo: locData
                            };
                            test1 = subject.createMainRecord(data);
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should not add uid property to record", function() {
                            expect(getPromValue(test1, true).uid).not.toBeDefined();
                            expect(getPromValue(test1, true)).toBeDefined();
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
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should not send full data object to mainArray if arg = true", function() {
                            expect(getPromValue(test1, true).geo).not.toBeDefined();
                            expect(getPromValue(test1, true)).toBeDefined();
                        });
                    });
                    describe("if undefined", function() {
                        beforeEach(function() {
                            var data = {
                                rec: newRecord,
                                geo: locData
                            };
                            test1 = subject.createMainRecord(data);
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should send full data object to mainArray if arg is undefined", function() {
                            expect(getPromValue(test1, true).geo).toBeDefined();
                            expect(getPromValue(test1, true)).toBeDefined();
                        });
                    });
                });
                it("should send correct path args to fireStarter", function() {
                    test = subject.createMainRecord(newRecord);
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    expect(subject.currentRef().parent().path).toEqual("https://your-firebase.firebaseio.com/trips");
                });
            });
            describe("removeMainRecord", function() {
                beforeEach(function() {
                    subject.mainArray();
                    $rootScope.$digest();
                    subject.currentRef().set(arrData);
                    $rootScope.$digest();
                    subject.currentRef().flush()
                    $rootScope.$digest();
                    $rootScope.$digest();
                });
                it("should remove the record and return a firebaseRef", function() {
                    test = subject.removeMainRecord(0);
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    expect(getPromValue(test).path).toEqual("https://your-firebase.firebaseio.com/trips/0");
                });
                it("shouldn't call $q.reject", function() {
                    expect($q.reject.calls.allArgs()).toEqual([]);
                    expect($q.reject.calls.count()).toEqual(0);
                });
            });
            describe("createNestedRecord", function() {});
            describe("removeNestedRecord", function() {});
            describe("Geofire", function() {
                describe("geofireSet", function() {});
                describe("geofireRemove", function() {});
                describe("createLocationRecord", function() {
                    beforeEach(function() {
                        test = subject.createLocationRecord(locData);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should add data to correct array", function() {
                        var arr = subject.currentRef();
                        // var key = arr.key().toString();
                        // expect(arr).toEqual("as");
                        // expect(arr.parent().path).toEqual("https://your-firebase.firebaseio.com/locations");
                        // expect(getRefData(arr)).toEqual(getRefData(subject.currentRef()));

                    });
                    logCallsContain("return from qALL");
                    it("should return the firebaseRef", function() {
                        $rootScope.$digest();
                        // expect(getRefData(getPromValue(test))).toBeDefined();
                    });

                });
                describe("createNestedLocationRecord", function() {});
                describe("removeLocationRecord", function() {});
                describe("removeNestedLocationRecord", function() {});
            });
            describe("User", function() {
                describe("createUserRecord", function() {
                    beforeEach(function() {
                        test = subject.createUserRecord(newData);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should add data to correct array", function() {
                        var arr = subject.currentRef();
                        var key = arr.key().toString();
                        expect(arr.parent().path).toEqual("https://your-firebase.firebaseio.com/users/1/trips");
                        expect(getRefData(arr)).toEqual(getRefData(subject.currentRef()));
                    });
                    it("should return the firebaseRef", function() {
                        $rootScope.$digest();
                        expect(getRefData(getPromValue(test))).toBeDefined();
                    });


                });
                describe("removeUserRecord", function() {
                    beforeEach(function() {
                        subject.userNestedArray();
                        $rootScope.$digest();
                        subject.currentRef().set(arrData);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        this.currentPath = subject.currentPath();
                        this.arrLength = subject.currentBase().length();
                        test = subject.removeUserRecord(0);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                    });
                    it("should remove the record", function() {
                        expect(this.arrLength).toEqual(2);
                        expect(getRefData(subject.parentRef())).toEqual({
                            1: arrData[1]
                        });
                    });

                    it("sets currentBase to a firebaseRef", function() {
                        expect(subject.currentBase()).toBeAFirebaseRef();
                        expect(subject.currentBase()).toEqual(subject.currentRef());
                    });
                    useParentRef();

                    it("should return the firebaseRef of the removed record", function() {
                        currentRefCheck("users/1/trips/0", true);
                    });

                    qRejectCheck(0);
                });
            });

        });
        describe("Simple Queries", function() {
            describe("loadMainArray", function() {});
            describe("loadMainRecord", function() {});
            describe("loadNestedArray", function() {
                //this should be use the built in method
            });
            describe("loadNestedRecord", function() {});
            describe("Geofire", function() {
                describe("geofireGet", function() {});
                describe("loadLocationRecord", function() {});
                describe("loadNestedLocationRecord", function() {});
                describe("MainLocations", function() {});
                describe("MainLocation", function() {});
            });
            describe("User", function() {
                describe("loadUserRecords", function() {
                    //TODO add option for loading indexes
                    beforeEach(function() {
                        test = subject.loadUserRecords();
                        $rootScope.$digest();
                        subject.currentRef().flush()
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should load correct firebaseRef", function() {
                        expect(getPromValue(test).$ref().path).toEqual("https://your-firebase.firebaseio.com/users/1/trips");
                    });
                    it("should return a fireBaseArray", function() {
                        expect(getPromValue(test)).toEqual(jasmine.objectContaining({
                            $keyAt: jasmine.any(Function),
                            $indexFor: jasmine.any(Function),
                            $remove: jasmine.any(Function),
                            $getRecord: jasmine.any(Function),
                            $add: jasmine.any(Function),
                            $watch: jasmine.any(Function)
                        }));
                    });


                });
                describe("loadUserRecord", function() {
                    //TODO add option for loading indexes
                    beforeEach(function() {
                        test = subject.loadUserRecord(1);
                        $rootScope.$digest();
                        subject.currentRef().flush()
                        $rootScope.$digest();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should load correct firebaseRef", function() {
                        expect(getPromValue(test).$ref().path).toEqual("https://your-firebase.firebaseio.com/users/1/trips/1");
                    });
                    it("should return a fireBaseObject", function() {
                        expect(getPromValue(test)).toEqual(jasmine.objectContaining({
                            $id: "1",
                            $priority: null,
                            $ref: jasmine.any(Function),
                            $value: null
                        }));
                    });
                    it("should have a $ref() property equal to currentRef()", function() {
                        expect(getPromValue(test).$ref()).toEqual(subject.currentRef());
                    });
                });
            });

        });
        describe("Complex Commands", function() {
            describe("Geofire", function() {
                describe("trackLocation", function() {});
                describe("untrackLocation", function() {});
                describe("trackLocations", function() {});
                describe("untrackLocations", function() {});
            });
        });
        describe("Complex Queries", function() {
            describe("loadMainFromUser", function() {

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

        function getPromValue(obj, flag) {
            if (flag === true) {
                return obj.$$state.value['data'];
            } else {
                return obj.$$state.value;
            }
        }

        function currentRefCheck(path, flag) {
            var root = "https://your-firebase.firebaseio.com/";
            if (flag === true) {
                return expect(subject.currentRef().path).toEqual(root.concat(path));
            } else {
                it("should set the correct currentRef with childPath: " + path, function() {
                    expect(subject.currentRef().path).toEqual(root.concat(path));
                });
            }
        }

        function currentBaseCheck(type, test) {
            switch (type) {
                case "object":
                    it("should return a fireBaseObject", function() {
                        expect(test).toEqual(jasmine.objectContaining({
                            $id: "1",
                            $priority: null,
                            $ref: jasmine.any(Function),
                            $value: null
                        }));
                    });
                    break;
                case "array":
                    it("should return a fireBaseArray", function() {
                        expect(test).toEqual(jasmine.objectContaining({
                            $keyAt: jasmine.any(Function),
                            $indexFor: jasmine.any(Function),
                            $remove: jasmine.any(Function),
                            $getRecord: jasmine.any(Function),
                            $add: jasmine.any(Function),
                            $watch: jasmine.any(Function)
                        }));
                    });
                    break;
            }
        }

        function logCallsContain(message) {
            it("should call $log.info with " + message, function() {
                var logArray = $log.info.calls.allArgs();
                var flatLog = logArray.reduce(function(x, y) {
                    return x.concat(y);
                }, []);
                expect(flatLog.indexOf(message)).toBeGreaterThan(-1);
            });
        }

        function logCount(x, flag) {
            if (flag === true) {
                return expect($log.info.calls.count()).toEqual(x);
            } else {
                it("should call $log.info " + x + " times", function() {
                    expect($log.info.calls.count()).toEqual(x);
                });
            }
        }

        function logCallCheck(x, flag) {
            if (flag === true) {
                return expect($log.info.calls.allArgs()).toEqual(x);
            } else {
                it("should log:" + x, function() {
                    expect($log.info.calls.allArgs()).toEqual(x);
                });
            }
        }

        function specificLogCall(x, message, flag) {
            if (flag === true) {
                return expect($log.info.calls.argsFor(x)).toEqual(message);
            } else {
                it("should log:" + message, function() {
                    expect($log.info.calls.argsFor(x)).toEqual(message);
                });
            }
        }

        function qRejectCheck(x, flag) {
            if (flag === true) {
                expect($q.reject.calls.allArgs()).toEqual([]);
                expect($q.reject.calls.count()).toEqual(x);
            } else {
                it("should call $q.reject " + x + " times", function() {
                    expect($q.reject.calls.allArgs()).toEqual([]);
                    expect($q.reject.calls.count()).toEqual(x);
                });
            }

        }

        function useParentRef() {
            it("should construct firebaseArray from parentRef", function() {
                logCallsContain("Using currentParentRef");
            });
        }

        function reUseCurrentRef() {
            it("should reuse currentRef", function() {
                logCallsContain("Reusing currentRef");
            });
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
