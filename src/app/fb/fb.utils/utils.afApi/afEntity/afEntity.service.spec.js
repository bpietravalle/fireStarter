(function() {
    "use strict";
    describe('afUtils Service', function() {
        var afEntity, root;


        beforeEach(function() {
            MockFirebase.override();
            module('fbMocks');
            module('utils.afApi');
            inject(function(_afEntity_) {
                root = 'https://your-firebase.firebaseio.com/';
                afEntity = _afEntity_;
            });
        });


        describe("objects", function() {

            it("should set path when passed an array of strings", function() {
                var test = afEntity.set("object", ["users", "1"]);
                expect(test.$ref().path).toEqual(root + "users/1");
            })
            it("should set path when passed an array of strings and numbers", function() {
                var test = afEntity.set("object", ["users", 1, "phones", 304]);
                expect(test.$ref().path).toEqual(root + "users/1/phones/304");
            })

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
                    entity = afEntity.set("object", "users");
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
                    entity = afEntity.set("array", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
        describe("accessible $firebaseAuth methods", function() {
            // can't test $unAuth via this macro
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
                    entity = afEntity.set();
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
    });
})(angular);
