(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        var firePath, arrData, newData, newRecord, test1, session, lastRecs, recRemoved, rootPath, copy, keys, testutils, root, success, failure, recAdded, sessionSpy, locData, userId, maSpy, maSpy1, mrSpy, naSpy, nrSpy, fsMocks, geo, test, ref, objRef, objCount, arrCount, arrRef, $rootScope, data, user, location, locationSpy, $injector, inflector, fsType, userSpy, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;


        beforeEach(function() {
            rootPath = "https://your-firebase.firebaseio.com";
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
                geofire: true,
                nestedArrays: ["phones"]
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
                it("should not change after successful command", function() {
                    subject.createMainRecord("data");
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).toEqual(base2);
                });
                it("should not change after successful queries that result in an array", function() {
                    subject.loadMainArray();
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1).toEqual(base2);
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
                it("should change if begin a new query or command with a different path", function() {
                    subject.mainRecord("data");
                    $rootScope.$digest();
                    var base1 = subject.currentBase();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                    subject.mainLocations();
                    $rootScope.$digest();
                    var base2 = subject.currentBase();
                    expect(base1.ref()).not.toEqual(base2.ref());

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
                    // expect(subject.currentRef()).toEqual(subject.currentBase().ref());
                });

                // it("should correctly set currentBase if command results in array", function() {
                //     subject.trackLocations(locData, "mainRecKey");
                //     $rootScope.$digest();
                //     subject.currentRef().flush();
                //     $rootScope.$digest();
                //     subject.currentRef().flush();
                //     $rootScope.$digest();
                //     var b = subject.currentRef();
                //     // expect(typeof b).toEqual('Array');
                // });
                it("should correctly assign ref of firebaseArrays", function() {
                    subject.loadMainArray();
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
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
                    test = subject.removeMainRecord(0);
                    $rootScope.$digest();
                    subject.currentRef().flush();
                    $rootScope.$digest();
                });
                it("should remove the record and return a firebaseRef", function() {
                    expect(getPromValue(test).path).toEqual("https://your-firebase.firebaseio.com/trips/0");
                });
                it("shouldn't call $q.reject", function() {
                    expect($q.reject.calls.allArgs()).toEqual([]);
                    expect($q.reject.calls.count()).toEqual(0);
                });
                useCurrentRef();
            });
            describe("Nested Arrays", function() {
                beforeEach(function() {
                    options = {
                        nestedArrays: ["phones"],
                        geofire: true

                    };
                    subject = fireEntity("trips", options);
                    $rootScope.$digest();
                    subject.mainArray();
                    $rootScope.$digest();
                    subject.currentRef().set({
                        name: "bill",
                        age: 100
                    });
                    subject.currentRef().flush();
                    $rootScope.$digest();
                });
                var methods = ["addPhone", "removePhone", "loadPhone", "loadPhones", "phone", "phones"];

                function nestedArr(x) {
                    it(x + " should be defined", function() {
                        expect(subject[x]).toBeDefined();
                    });
                }
                methods.forEach(nestedArr);
                it("simple checks on setup", function() {
                    expect(getRefData(subject.currentRef())).toEqual({
                        name: "bill",
                        age: 100
                    });

                });

                describe("add", function() {
                    beforeEach(function() {
                        subject.addPhone(0, {
                            type: "cell",
                            number: 123456789
                        });
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        this.key = subject.currentRef().key();
                    });
                    it("should add data to correct node", function() {
                        expect(subject.parentRef().path).toEqual(rootPath + "/trips/0/phones");
                        expect(getRefData(subject.parentRef())[this.key]).toEqual({
                            type: "cell",
                            number: 123456789
                        });
                    });
                    qRejectCheck(0);
                    describe("remove", function() {
                        beforeEach(function() {
                            subject.removePhone(0, this.key);
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should remove the correct record", function() {
                            $rootScope.$digest();
                            expect(subject.parentRef().path).toEqual(rootPath + "/trips/0/phones");
                            expect(getRefData(subject.parentRef())).toEqual(null);
                        });
                        qRejectCheck(0);
                    });
                    describe("load", function() {
                        beforeEach(function() {
                            subject.loadPhone(0, this.key);
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should load the correct record", function() {
                            expect(subject.currentPath()).toEqual(rootPath + "/trips/0/phones/" + this.key);
                            expect(getRefData(subject.parentRef())[this.key]).toEqual({
                                type: "cell",
                                number: 123456789
                            });
                        });
                        qRejectCheck(0);
                    });
                    describe("load All", function() {
                        beforeEach(function() {
                            subject.loadPhones(0);
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                        });
                        it("should load the correct record", function() {
                            expect(subject.currentPath()).toEqual(rootPath + "/trips/0/phones");
                            expect(getRefData(subject.currentRef())[this.key]).toEqual({
                                type: "cell",
                                number: 123456789
                            });
                        });
                        qRejectCheck(0);
                    });



                });
            });

            describe("Geofire", function() {
                describe("geofireSet", function() {
                    beforeEach(function() {
                        test = subject.geofireSet("myKey", [90, 100]);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        $rootScope.$digest();
                        this.ref = subject.currentRef();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should add data to correct array", function() {
                        expect(getRefData(this.ref)).toEqual({
                            myKey: {
                                g: jasmine.any(String),
                                l: [90, 100]
                            }
                        });
                    });
                    it("should return null", function() {
                        expect(getPromValue(test)).toEqual(undefined);
                    });
                    qRejectCheck(0);
                    describe("geofireRemove", function() {
                        beforeEach(function() {
                            test = subject.geofireRemove("myKey");
                            $rootScope.$digest();
                            subject.currentRef().flush();
                            $rootScope.$digest();
                            $rootScope.$digest();
                            this.ref = subject.currentRef();
                        });
                        it("should return a promise", function() {
                            expect(test).toBeAPromise();
                        });
                        it("should return null", function() {
                            expect(getPromValue(test)).toEqual(undefined);
                        });
                        it("should remove data correctly", function() {
													expect(this.ref.path).toEqual(rootPath + "/geofire/trips");
                            expect(getRefData(this.ref)).toEqual(null);
                        });
                        qRejectCheck(0);
                    });
                });
                describe("createLocationRecord", function() {
                    beforeEach(function() {
                        test = subject.createLocationRecord(locData[0]);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        this.ref = subject.currentRef()[0];
                        this.key = this.ref.key().toString();
                    });
                    it("should return a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should add data to correct array", function() {
                        expect(getRefData(this.ref)).toEqual(locData[0]);
                    });
                    it("should return the correct firebaseRef", function() {
                        expect(this.ref.path).toEqual("https://your-firebase.firebaseio.com/locations/trips/" + this.key);
                    });
                    it("should return an array with a firebaseRef and a object with coordinates", function() {
                        expect(getPromValue(test).length).toEqual(2);
                        expect(getPromValue(test)[0]).toBeAFirebaseRef();
                        expect(getPromValue(test)[1]).toEqual({
                            lat: 90,
                            lon: 100
                        });
                    });
                });
                describe("removeLocationRecord", function() {
                    beforeEach(function() {
                        subject.mainLocations();
                        $rootScope.$digest();
                        subject.currentRef().set(locData);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                        this.currentPath = subject.currentPath();
                        this.arrLength = subject.currentBase().length();
                        test = subject.removeLocationRecord(0);
                        $rootScope.$digest();
                        subject.currentRef().flush();
                        $rootScope.$digest();
                    });
                    it("should remove the record", function() {
                        expect(this.arrLength).toEqual(2);
                        expect(getRefData(subject.parentRef())).toEqual({
                            1: locData[1]
                        });
                    });

                    useParentRef();

                    it("should return the firebaseRef of the removed record", function() {
                        currentRefCheck("locations/trips/0", true);
                    });

                    qRejectCheck(0);
                });
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
                    // logCheck();

                    useParentRef();
                    useCurrentRef();

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
            describe("Geofire", function() {
                describe("geofireGet", function() {});
                describe("loadLocationRecord", function() {});
                describe("MainLocations", function() {});
                describe("MainLocation", function() {});
            });
            describe("Nested Arrays", function() {});
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

        function logContains(message) {
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

        function testCheck(x, flag) {
            if (flag === true) {
                return expect(test).toEqual(x);
            } else {
                it("should work", function() {
                    expect(test).toEqual(x);
                });
            }
        }

        function logCheck(x, flag) {
            if (flag === true) {
                return expect($log.info.calls.allArgs()).toEqual(x);
            } else {
                it("should log:" + x, function() {
                    expect($log.info.calls.allArgs()).toEqual(x);
                });
            }
        }

        function logNum(x, message, flag) {
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
            it("should construct firebase from parentRef", function() {
                logContains("Using currentParentRef");
            });
        }

        function useNewBase() {
            it("should construct a new firebase", function() {
                logContains("Building new firebase");
            });
        }

        function useChildRef() {
            it("should construct firebase from childRef", function() {
                logContains("Building childRef");
            });
        }

        function useCurrentRef() {
            it("should reuse currentRef", function() {
                logContains("Reusing currentRef");
            });
        }

        function inspect(x) {
            if (angular.isObject(x)) {
                it("should be inspected", function() {
                    expect(x.inspect()).toEqual("inspect!");
                });
            } else {
                it("should be inspected", function() {
                    expect(subject.inspect()).toEqual("inspect!");
                });

            }
        }

        function subject(x) {
            if (angular.isObject(x)) {
                it("should be the subject", function() {
                    expect(x).toEqual("subject!");
                });
            } else {
                it("should be the subject", function() {
                    expect(subject).toEqual("heres the subject!");
                });

            }
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
