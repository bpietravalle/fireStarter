(function() {
    "use strict";
    describe('fireStarter Factory', function() {
        var fireStarter, test, baseBuilder, $rootScope, deferred, root, path, $q, $timeout;


        beforeEach(function() {
            MockFirebase.override();
            module('fbMocks');
            module('fb.constant');
            module('fireStarter.services');
            inject(function(_fireStarter_, _baseBuilder_, _$rootScope_, _$q_, _$timeout_, _FBURL_) {
                fireStarter = _fireStarter_;
                $timeout = _$timeout_;
                $rootScope = _$rootScope_;
                $q = _$q_;
                baseBuilder = _baseBuilder_;
                deferred = $q.defer();
            });
            path = ["path"]
        });
        describe("constructor", function() {
            beforeEach(function() {
                spyOn(baseBuilder, 'init').and.callThrough(); //Fake(function(){
									// return deferred.promise;
								// });
                test = fireStarter("object", path);
            });
            it("should be defined", function() {
                expect(fireStarter).toBeDefined();
            });
            it("should resolve the promise", function() {
							// deferred.resolve({
							// 	$ref: function(){
							// 	return "boom"}
							// });
							// $timeout.flush();
							// $rootScope.$digest();
							expect(baseBuilder.init.calls.count()).toEqual(1);
							// expect(test.test()).toEqual(1);
							// expect(test.()).toEqual(1);

            });

        });
        /*
         * each type
         * with flag and without
         *
         * each method: is a promise
         * calls correct af/geo method
         *
         * errors
         */
        describe("No flag", function() {

            var types = [
                ["array", ["add", "destroy", "getRecord", "keyAt", "indexFor", "loaded", "ref", "remove", "save"]],
                ["object", ["bindTo", "destroy", "id", "loaded", "ref", "remove", "save", "priority", "value"]],
                ["auth", ["authWithPassword", "authWithOAuthPopup", "changePassword", "changeEmail", "createUser", "getAuth", "removeUser", "requireAuth", "resetPassword", "unauth"]],
                ["geo", ["distance", "get", "query", "ref", "remove", "set"]]
            ];


            function simpleTests(y) {
                var defined = [];
                var promises = [];
                var defaultMethods = ["timestamp", "path"];


                describe(y[0], function() {
                    beforeEach(function() {
                        test = fireStarter(y[0], path);
                    });
                    it("should be defined", function() {
                        expect(fireStarter(y[0], path)).toBeDefined();
                    });
                    Array.prototype.push.apply(defined, defaultMethods);
                    Array.prototype.push.apply(defined, y[1]);
                    Array.prototype.push.apply(promises, y[1]);

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
                    defined.forEach(defineTests);
                    // promises.forEach(promiseTests);
                });
            }

            types.forEach(simpleTests);
        });
    });
})(angular);
