(function(angular) {
    "use strict";

    describe('fbutil', function() {
        var fbutil;
        beforeEach(function() {
            module('mock.firebase');
            module('fb.utils');
        });
        beforeEach(inject(function(_fbutil_) {
            fbutil = _fbutil_;
        }));

        it("should exist", function() {
            expect(fbutil).toBeDefined();
        });

        describe('handler', function() {
            it('should have tests');
        });

        describe('defer', function() {
            it('should have tests');
        });

        describe('ref', function() {
            it("firebaseRef is a function", function() {
                expect(typeof firebaseRef).toBe('function');
            });
        });

    });

}(angular));
