(function() {
    "use strict";
    describe('fireStarter Factory', function() {
        var rootPath, success, failure, fireStarter, ref, test, test1, $log, $rootScope, deferred, root, path, $q, $timeout;


        beforeEach(function() {
            MockFirebase.override();
            angular.module("firebase.starter")
                .constant('FBURL', 'https://your-firebase.firebaseio.com/');
            module('firebase.starter');
            inject(function(_fireStarter_, _$log_, _$rootScope_, _$q_, _$timeout_) {
                $log = _$log_;
                fireStarter = _fireStarter_;
                $timeout = _$timeout_;
                $rootScope = _$rootScope_;
                $q = _$q_;
                deferred = $q.defer();
            });
            rootPath = "https://your-firebase.firebaseio.com";
            ref = new MockFirebase("data://");
            path = ["path"]
            spyOn($log, "info").and.callThrough();
            spyOn($q, "reject").and.callThrough();
            success = jasmine.createSpy("success");
            failure = jasmine.createSpy("failure");
        });
        describe("constructor", function() {
            beforeEach(function() {
                test = fireStarter("object", path);
            });
            it("should be defined", function() {
                expect(fireStarter).toBeDefined();
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
                it("should return the firebase ref of the array", function() {
                    expect(getPromValue(test)).toBeAFirebaseRef();
                    expect(getPromValue(test).toString()).toEqual(rootPath + "/trips");
                });
            });

            describe("get()", function() {
                beforeEach(function() {
                    test = path.get("key");
                    $timeout.flush();
                    $rootScope.$digest();
                    path.ref().flush();
                    $rootScope.$digest();
                });
                it("should be a promise", function() {
                    expect(test).toBeAPromise();
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
            ],
        ];

        function afBaseTest(y) {
            describe(y[0], function() {
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

        function wrapPromise(p) {
            return p.then(success, failure);
        }

        function getPromValue(obj) {
            return obj.$$state.value;
        }
    });
})(angular);
