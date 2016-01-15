(function() {
    "use strict";
    describe('Config', function() {
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
        var rootPath, $timeout, fireStarter, ref, test, test1, $log, $rootScope, path, $q;


        beforeEach(function() {
            MockFirebase.override();
            rootPath = "https://your-firebase.firebaseio.com";
            angular.module("firebase.starter")
                .config(function(fireStarterProvider) {
                    fireStarterProvider.setRoot(rootPath);
                });
            module('firebase.starter');
            inject(function(_fireStarter_, _$log_, _$rootScope_, _$q_,_$timeout_) {
                $log = _$log_;
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

            // function resolve(obj, cb) {
            //     return obj.$$state.pending[0][0].resolve(cb);
            // }

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

        function getPromValue(obj) {
            return obj.$$state.value;
        }
    });
})(angular);
