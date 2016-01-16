(function() {
    "use strict";
    describe('Configuration', function() {
        var fireStarter;
        var invalid = [
            ["object", {}],
            ["number", 123123],
            ["undefined", undefined],
            ["null", null]
        ];

        function notStrTest(y) {
            describe("With rootPath that = " + y[0], function() {
                beforeEach(function() {
                    angular.module("firebase.starter")
                        .config(function(fireStarterProvider) {
                            fireStarterProvider.setRoot(y[1]);
                        });
                    module('firebase.starter');
                    inject(function(_fireStarter_) {
                        fireStarter = _fireStarter_;
                    });
                });
                it("should throw error", function() {
                    expect(function() {
                        fireStarter("geo", ["path"]);
                    }).toThrow();
                });
            });
        }
        invalid.forEach(notStrTest);
        describe("Valid", function() {
            var test;
            beforeEach(function() {
                angular.module("firebase.starter")
                    .config(function(fireStarterProvider) {
                        fireStarterProvider.setRoot("http://root.ref.com");
                    });
                module('firebase.starter');
                inject(function(_fireStarter_) {
                    fireStarter = _fireStarter_;
                });
                test = fireStarter("geo", ["path"]);
            });
            it("should de defined", function() {
                expect(test).toBeDefined();
            });
        });
    });
    describe('fireStarter Factory', function() {
        var rootPath, geofire, $timeout, fireStarter, ref, test, test1, $log, $rootScope, path, $q;


        beforeEach(function() {
            MockFirebase.override();
            rootPath = "https://your-firebase.firebaseio.com";
            angular.module("firebase.starter")
                .config(function(fireStarterProvider) {
                    fireStarterProvider.setRoot(rootPath);
                });
            module('firebase.starter');
            inject(function(_fireStarter_, _geofireFactory_, _$log_, _$rootScope_, _$q_, _$timeout_) {
                $log = _$log_;
                geofire = _geofireFactory_;
                $timeout = _$timeout_;
                fireStarter = _fireStarter_;
                $rootScope = _$rootScope_;
                $q = _$q_;
            });
            spyOn($log, "info").and.callThrough();
            spyOn($q, "reject").and.callThrough();
        });
        describe("constructor", function() {
            beforeEach(function() {
                test = fireStarter("geo", ["path"]);
            });
            it("should be defined", function() {
                expect(test).toBeDefined();
            });
            describe("Creating Path", function() {
                it("should change numbers to strings for path", function() {
                    var test = fireStarter("object", ["user", 123, "phones"]);
                    expect(function() {
                        test;
                    }).not.toThrow();
                    expect(test.$ref().toString()).toEqual(rootPath + "/user/123/phones");
                });
                it("should flatten nexted array for path", function() {
                    var test = fireStarter("ref", ["user", ['123', "phones"]]);
                    expect(function() {
                        test;
                    }).not.toThrow();
                    expect(test.toString()).toEqual(rootPath + "/user/123/phones");
                });
            });
            describe("Invalid Params", function() {
                it("should throw exception if flag isn't true or undefined", function() {
                    var ref = new MockFirebase(rootPath);
                    expect(function() {
                        fireStarter("object", ref, {});
                    }).toThrow();
                    expect(function() {
                        fireStarter("object", ref, false);
                    }).toThrow();
                });
                it("should throw exception if path is array and flag is defined", function() {
                    expect(function() {
                        fireStarter("object", ["path"], {});
                    }).toThrow();
                });
                it("should throw exception if path is string and flag is defined", function() {
                    expect(function() {
                        fireStarter("object", "path", true);
                    }).toThrow();
                });
                it("should throw exception if an item of path array isn't a number or string", function() {
                    function myName() {
                        "brian"
                    }
                    expect(function() {
                        fireStarter("ref", ["path", myName]);
                    }).toThrow();
                    expect(function() {
                        fireStarter("ref", ["path", {}]);
                    }).toThrow();
                    expect(function() {
                        fireStarter("ref", ["path", undefined]);
                    }).toThrow();
                });

            });
        });
        describe("Auth", function() {
            beforeEach(function() {
                test = fireStarter("auth");
            });
            it("should be defined", function() {
                expect(fireStarter).toBeDefined();
            });
            it("should be a $firebaseAuth object", function() {
                expect(test.$onAuth).toEqual(jasmine.any(Function));
                expect(test.$createUser).toEqual(jasmine.any(Function));
                expect(test.$removeUser).toEqual(jasmine.any(Function));
            });
        });


        describe("geofire", function() {
            beforeEach(function() {
                path = fireStarter("geo", "trips");
                test = path.set("key", [90, 100]);
                $rootScope.$digest();
                $timeout.flush();
                path.ref().flush();
                $rootScope.$digest();
                test1 = path.set("key2", [50, 75]);
                $rootScope.$digest();
                $timeout.flush();
                $rootScope.$digest();
                path.ref().flush();
                $rootScope.$digest();
            });
            it("$ref() should === ref()", function() {
                expect(path.$ref()).toEqual(path.ref());
            });
            it("should be firebaseRefs", function() {
                expect(path.$ref()).toBeAFirebaseRef();
            });
            describe("Inspect Method", function() {
                it("should return 'self' object", function() {
                    expect(path.inspect()).toEqual(jasmine.objectContaining({
                        _rootPath: rootPath,
                        _path: "trips",
                        _type: "geo",
                        _timeout: jasmine.any(Function),
                        _firebaseAuth: jasmine.any(Function),
                        _firebaseObject: jasmine.any(Function),
                        _firebaseArray: jasmine.any(Function),
                        _GeoFire: jasmine.any(Object),
                        _q: jasmine.any(Function),
                        _log: jasmine.any(Object),
                        _firebase: jasmine.any(Object)
                    }));
                });
            });
            describe("GeoQuery", function() {
                var subject;
                beforeEach(function() {
                    ref = new MockFirebase(rootPath).child("geofire");
                    extend(ref);
                    $rootScope.$digest();
                    subject = fireStarter("geo", ref, true);

                });
                describe("Constructor", function() {
                    beforeEach(function() {
                        test = subject.query({
                            center: [90, 100],
                            radius: 15
                        });
                        $rootScope.$digest();
                    });
                    it("should be a promise", function() {
                        expect(test).toBeAPromise();
                    });
                    it("should resolve to an object", function() {
                        expect(getPromValue(test)).toBeAn("object");
                    });

                    var meth = ["radius", "center", "updateCriteria", "on", "cancel"]

                    function definedTest(y) {
                        it(y + " should be defined", function() {
                            expect(getPromValue(test)[y]).toBeDefined();
                        });
                        it(y + " should be a function", function() {
                            expect(getPromValue(test)[y]).toBeA("function");
                        });
                    }
                    meth.forEach(definedTest);
                });
                describe("Returned Object", function() {
                    var querySpy;
                    beforeEach(function() {
                        spyOn(geofire, "init").and.callFake(function() {
                            return {
                                query: function() {
                                    return querySpy;
                                }
                            };
                        });
                        subject = fireStarter("geo", ref, true);
                        querySpy = jasmine.createSpyObj("querySpy", ["radius", "center", "updateCriteria", "on", "cancel"]);
                        test = subject.query({
                            center: [90, 100],
                            radius: 15
                        });
                        $rootScope.$digest();
                        test = getPromValue(test);
                    });
                    var meths = ["center", "radius", "on", "updateCriteria", "cancel"];

                    function queryMethodTest(y) {
                        it("should call " + y + " on query object", function() {
                            test[y]();
                            if (y === "updateCriteria") {
                                $timeout.flush();
                            }
                            expect(querySpy[y]).toHaveBeenCalled();
                        });
                    }
                    meths.forEach(queryMethodTest);
                });
                describe("on()", function() {
                    var reg, cb = jasmine.createSpy("cb"),
                        ctx = jasmine.createSpy("ctx");
                    beforeEach(function() {
                        test = subject.query({
                            center: [90, 100],
                            radius: 15
                        });
                        $rootScope.$digest();
                        test = getPromValue(test)
                        reg = test.on("key_entered", cb, ctx);
                    });
                    it("should return a geoCallbackRegistration", function() {
                        expect(reg.cancel).toEqual(jasmine.any(Function));
                    });
                });
            });

            describe("set()", function() {
                it("should be a promise", function() {
                    expect(test).toBeAPromise();
                });
                it("should add data to correct node", function() {
                    expect(path.ref().toString()).toEqual(rootPath + "/trips");
                    expect(path.ref().getData()["key"]).toEqual({
                        g: jasmine.any(String),
                        l: [90, 100]
                    });
                    expect(path.ref().getData()["key2"]).toEqual({
                        g: jasmine.any(String),
                        l: [50, 75]
                    });
                });
                it("should return the firebase ref of the updated array", function() {
                    expect(getPromValue(test)).toBeAFirebaseRef();
                    expect(getPromValue(test).toString()).toEqual(rootPath + "/trips");
                    expect(getPromValue(test).getData().key).toBeDefined();
                    expect(getPromValue(test).getData().key2).toBeDefined();
                });
            });

            describe("get()", function() {
                beforeEach(function() {});
                it("should be a promise", function() {
                    test = path.get("key");
                    expect(test).toBeAPromise();
                });
                it("should add correct record to flush queue", function() {
                    test = path.get("key");
                    $rootScope.$digest();
                    $timeout.flush();
                    $rootScope.$digest();
                    expect(flushData().key()).toEqual("key");
                    expect(flushData().getData()).toEqual({
                        g: jasmine.any(String),
                        l: [90, 100]
                    });
                    expect(flushData()).toBeAFirebaseRef();
                });
                it("should return correct record to flush queue", function() {
                    test1 = path.get("key2");
                    $rootScope.$digest();
                    $timeout.flush();
                    $rootScope.$digest();
                    expect(flushData().getData()).toEqual({
                        g: jasmine.any(String),
                        l: [50, 75]
                    });
                    expect(flushData().key()).toEqual("key2");
                    expect(flushData()).toBeAFirebaseRef();
                });
            });

            function flushData(key) {
                if (key) {
                    return path.ref().getFlushQueue()[0].context[key];
                } else {
                    return path.ref().getFlushQueue()[0].context;

                }
            }

            describe("distance()", function() {
                beforeEach(function() {
                    var dc = [38.907, -77.037];
                    var ma = [42.2137, -71.779913];
                    test = path.distance(dc, ma);
                    test1 = path.distance(ma, dc);
                });
                it("should not be a promise", function() {
                    expect(test).not.toBeAPromise();
                });
                it("should be a number", function() {
                    expect(test).toEqual(test1);
                    expect(test).toBeGreaterThan(500);
                    expect(test).toEqual(jasmine.any(Number));
                });
            });

            describe("remove()", function() {
                beforeEach(function() {
                    test = path.remove("key");
                    $timeout.flush();
                    $rootScope.$digest();
                    path.ref().flush();
                    $rootScope.$digest();
                });
                it("should be a promise", function() {
                    expect(test).toBeAPromise();
                });
                it("should remove the correct record", function() {
                    expect(path.ref().getData()).toEqual({
                        key2: {
                            g: jasmine.any(String),
                            l: [50, 75]
                        }
                    });

                });
                it("should return the firebase ref of the updated array", function() {
                    expect(getPromValue(test)).toBeAFirebaseRef();
                    expect(getPromValue(test).toString()).toEqual(rootPath + "/trips");
                    expect(getPromValue(test).getData().key2).toBeDefined();
                    expect(getPromValue(test).getData().key).not.toBeDefined();
                });

            });
        });
        var afTypes = [
            ["array", ["$getRecord", "$keyAt", "$indexFor", "$ref", "$destroy"],
                ["$add", "$loaded", "$remove", "$save"]
            ],
            ["object", ["$id", "$ref", "$priority", "$destroy"],
                ["$save", "$remove", "$loaded", "$bindTo"]
            ],
            ["auth", ["$unauth", "$getAuth"],
                ["$authWithPassword", "$authWithOAuthPopup", "$changePassword", "$changeEmail", "$createUser", "$removeUser", "$requireAuth", "$resetPassword"]
            ]
        ];

        function afBaseTest(y) {
            describe(y[0], function() {
                MockFirebase.override();
                ref = new MockFirebase("data://");
                var defined = [];
                var promises = [];
                Array.prototype.push.apply(defined, y[1]);
                Array.prototype.push.apply(defined, y[2]);
                Array.prototype.push.apply(promises, y[2]);



                function defineTests(x) {
                    it(x + " should be defined", function() {
                        expect(test[x]).toBeDefined();
                    });
                }

                function promiseTests(x) {
                    it(x + " should be a promise", function() {
                        expect(test[x]()).toBeAPromise();
                    });

                }

                describe("constructing firebaseRef", function() {
                    beforeEach(function() {
                        test = fireStarter(y[0], ["trips"]);
                        if (y[0] === "object") {
                            test.$value = "test";
                            test.$ref().flush();
                        }

                    });
                    it("should be defined", function() {
                        expect(test).toBeDefined();
                    });

                    defined.forEach(defineTests);
                    promises.forEach(promiseTests);
                });
                describe("passing a firebaseRef", function() {
                    beforeEach(function() {
                        ref = ref.child("trips");
                        test = fireStarter(y[0], ref, true);
                        if (y[0] === "object") {
                            test.$value = "test";
                            test.$ref().flush();
                        }
                    });
                    it("should be defined", function() {
                        expect(test).toBeDefined();
                    });

                    defined.forEach(defineTests);
                    promises.forEach(promiseTests);
                });
            });

        }
        afTypes.forEach(afBaseTest);

        function extend(obj) {
            return angular.extend(obj, {
                orderByChild: jasmine.createSpy('child').and.callFake(function() {
                    return {
                        startAt: function() {
                            return {
                                endAt: function() {
                                    return {
                                        on: jasmine.createSpy("on")
                                    };

                                }
                            };
                        }
                    };
                })
            });

        }

        function getPromValue(obj) {
            return obj.$$state.value;
        }
    });
})(angular);
