(function() {
    "use strict";

    describe('fbRef', function() {
        var fbRef, FBURL;
        beforeEach(function() {
            MockFirebase.override();
            module('utils.jsApi');
        });
        beforeEach(inject(function(_fbRef_, _FBURL_) {
            fbRef = _fbRef_;
            FBURL = _FBURL_;
        }));

        it("should exist", function() {
            expect(fbRef).toBeDefined();
        });

        describe('path', function() {
            it("returns the correct string if passed an array of strings", function() {
                expect(fbRef.path(["a_string", "another"])).toEqual("a_string/another");
            });
            // it("throws an error if args !== array", function(){
            // });
        });
        describe('root', function() {
            it("returns a firebase with path = parentRef", function() {
                expect(fbRef.root().path).toEqual(FBURL);
            });
        });
        describe('ref', function() {
            it("ref.path returns correct URL with child path", function() {
                var url = "a_string";
                var test = fbRef.ref(url);
                expect(test.path).toEqual(FBURL + 'a_string');
            });
            it("ref.path returns parent URL if no child path given", function() {
                var test = fbRef.root();
                expect(test.path).toEqual(FBURL);
            });
            it("ref.path returns correct URL when path = array", function() {
                var test = fbRef.ref('users', 'phones', '15');
                expect(test.path).toEqual(FBURL + 'users/phones/15');
            });
            it("ref.path returns correct URL when path = array of arrays", function() {
                var test = fbRef.ref('users', ['phones', 'boom'], '15');
                expect(test.path).toEqual(FBURL + 'users/phones/boom/15');
            });
            //not passing below - matcher syntax
            // it("ref.path throws error if path array item isn't a string", function() {
            //     var fn = fbRef.ref('users', 'phones', 15);
            //     expect(fn).toThrowError();
            // });
        });
    });
})(angular);
