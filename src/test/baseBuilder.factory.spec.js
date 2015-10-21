(function() {
    "use strict";
    describe('baseBuilder Service', function() {
        var baseBuilder, $rootScope, $log, deferred, root, $q, $timeout;


        beforeEach(function() {
            MockFirebase.override();
            module('fbMocks');
            module('fb.constant');
            module('utils.afApi');
            inject(function(_baseBuilder_, _$log_, _$rootScope_, _$q_, _$timeout_, _FBURL_) {
                $timeout = _$timeout_;
                $log = _$log_;
                $rootScope = _$rootScope_;
                $q = _$q_;
                root = _FBURL_;
                baseBuilder = _baseBuilder_;
                deferred = $q.defer();
            });
            spyOn($log, "info").and.callThrough();
            spyOn($q, "all").and.callThrough();
            spyOn($q, "when").and.callThrough();
        });

        describe("init", function() {
            beforeEach(function() {
                spyOn(deferred, "resolve").and.callThrough();
                spyOn(deferred, "reject").and.callThrough();
            });
            // it("build", function(){
            // 	this.test = baseBuilder.build("object",["tips"]);
            // 	$rootScope.$digest();
            // 	$rootScope.$digest();
            // 	$timeout.flush();
            // 	expect(this.test).toBeAPromise();
            // 	expect(this.test).toEqual(1);
            // });
            // it("set", function(){
            // 	this.test = baseBuilder.set("object",["tips"]);
            // 	$rootScope.$digest();
            // 	expect(this.test).toEqual(1);
            // });
            // it("should resolve the promise", function(){
            // 	baseBuilder.build("object",["tips"]);
            // 	$rootScope.$digest();
            // 	$timeout.flush();
            // 	expect(deferred.resolve.calls.count()).toEqual(1);
            // 	expect(deferred.reject.calls.count()).toEqual(0);
            // });

        });

        describe("objects", function() {

            it("should set path when passed an array of strings", function() {
                var test = baseBuilder.set("object", ["users", "1"]);
                expect(test.$ref().path).toEqual(root + "users/1");
            });
            it("should set path when passed an array of strings and numbers", function() {
                var test = baseBuilder.set("object", ["users", 1, "phones", 304]);
                expect(test.$ref().path).toEqual(root + "users/1/phones/304");
            });

        });


        describe("accessible $firebaseObject methods", function() {
            var entity, val, meth;
            var methodsForObj = [
                ['$id', 'string'],
                ['$priority', 'object'],
                ['$ref', 'function'],
                ['$save', 'function'],
                ['$loaded', 'function'],
                ['$destroy', 'function'],
                ['$bindTo', 'function'],
                ['$watch', 'function'],
                ['$loaded', 'function'],
                ['$remove', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = baseBuilder.set("object", ["users"]);
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methodsForObj.forEach(test_entity_methods);
        });
        describe("accessible $firebaseArray methods", function() {
            var entity, val, meth;
            var methods = [
                ['$add', 'function'],
                ['$remove', 'function'],
                ['$save', 'function'],
                ['$getRecord', 'function'],
                ['$keyAt', 'function'],
                ['$indexFor', 'function'],
                ['$loaded', 'function'],
                ['$ref', 'function'],
                ['$watch', 'function'],
                ['$destroy', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = baseBuilder.set("array", ["users"]);
                    val = y[1];
                    meth = y[0];

                    $rootScope.$digest();
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
        describe("accessible $firebaseAuth methods", function() {
            var entity, val, meth;
            var methods = [
                ['$authWithCustomToken', 'function'],
                ['$authAnonymously', 'function'],
                ['$authWithPassword', 'function'],
                ['$authWithOAuthPopup', 'function'],
                ['$authWithOAuthRedirect', 'function'],
                ['$getAuth', 'function'],
                ['$onAuth', 'function'],
                ['$waitForAuth', 'function'],
                ['$requireAuth', 'function'],
                ['$createUser', 'function'],
                ['$changePassword', 'function'],
                ['$changeEmail', 'function'],
                ['$removeUser', 'function'],
                ['$resetPassword', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = baseBuilder.set("auth");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
    });
})(angular);
