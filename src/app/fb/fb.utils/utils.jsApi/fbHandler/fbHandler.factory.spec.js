(function() {
    "use strict";

    describe('fbHandler', function() {
        var fbHandler;
        beforeEach(function() {
            MockFirebase.override();
            module('utils.jsApi');
        });
        beforeEach(inject(function(_fbHandler_) {
            fbHandler = _fbHandler_;
        }));

        it("should exist", function() {
            expect(fbHandler).toBeDefined();
        });

        describe('handler', function() {
            it(" fbHandler.handler is a function", function() {
                expect(typeof fbHandler.handler).toBe('function');
            });
        });

        describe('defer', function() {
            it(" fbHandler.defer is a function", function() {
                expect(typeof fbHandler.defer).toBe('function');
            });
        });

    });
})(angular);
