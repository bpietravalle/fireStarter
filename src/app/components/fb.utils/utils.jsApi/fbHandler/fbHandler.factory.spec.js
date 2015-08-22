(function() {
    "use strict";

    describe('fbEntity', function() {
        var fbEntity;
        beforeEach(function() {
            MockFirebase.override();
            module('utils.jsApi');
        });
        beforeEach(inject(function(_fbEntity_) {
            fbEntity = _fbEntity_;
        }));

        it("should exist", function() {
            expect(fbEntity).toBeDefined();
        });

        describe('handler', function() {
            it(" fbEntity.handler is a function", function() {
                expect(typeof fbEntity.handler).toBe('function');
            });
        });

        describe('defer', function() {
            it(" fbEntity.defer is a function", function() {
                expect(typeof fbEntity.defer).toBe('function');
            });
        });

        describe('ref', function() {
            var FBURL;
            beforeEach(inject(function(_FBURL_) {
                FBURL = _FBURL_;
            }));

            it("fbEntity.ref is a function", function() {
                expect(typeof fbEntity.ref).toBe('function');
            });

            it("ref.path returns correct URL with child path", function() {
                var path = "a_string";
                var test = fbEntity.ref(path);
                expect(test.path).toEqual('https://your-firebase.firebaseio.com/a_string');
            });
            it("ref.path returns parent URL if no child path given", function() {
                var test = fbEntity.ref();
                expect(test.path).toEqual(FBURL);
            });
            it("ref.path returns correct URL when path = array", function() {
                var test = fbEntity.ref('users', 'phones', '15');
                expect(test.path).toEqual('https://your-firebase.firebaseio.com/users/phones/15');
            });
            //not passing below - matcher syntax
            // it("ref.path throws error if path array item isn't a string", function() {
            //     var fn = fbEntity.ref('users', 'phones', 15);
            //     expect(fn).toThrowError();
            // });
        });
    });
})(angular);
