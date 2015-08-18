(function(angular) {
        "use strict";

        describe('fbutil', function() {
            var fbutil;
            beforeEach(function() {
                // module('mock.firebase');
                module('fb.utils');
            });
            beforeEach(inject(function(_fbutil_) {
                fbutil = _fbutil_;
            }));

            it("should exist", function() {
                expect(fbutil).toBeDefined();
            });

            describe('handler', function() {
                it(" fbutil.handler is a function", function() {
                    expect(typeof fbutil.handler).toBe('function');
                });
            });

            describe('defer', function() {
                it(" fbutil.defer is a function", function() {
                    expect(typeof fbutil.defer).toBe('function');
                });
            });

            describe('ref', function() {
                var FBURL;
                beforeEach(inject(function(_FBURL_) {
                   FBURL = _FBURL_;
                }));

                it("fbutil.ref is a function", function() {
                    expect(typeof fbutil.ref).toBe('function');
                });

                it("ref.path returns correct URL with child path", function() {
                    var path = "a_string";
                    var test = fbutil.ref(path);
                    expect(test.path).toEqual('https://your-firebase.firebaseio.com/a_string');
                });
                it("ref.path returns parent URL if no child path given", function() {
                    var test = fbutil.ref();
                    expect(test.path).toEqual(FBURL); 
                });
            });
        });
})(angular);
