(function(angular) {
    "use strict";

    describe("RegService", function() {
        var reg;
        beforeEach(function() {
            module("fb.auth");
            module("firebase");
        });

        beforeEach(inject(function(_reg_) {
            reg =_reg_;
        }));

        it("should exist", function() {
            expect(reg).toBeDefined();
        });
        // it("reg.googleLogin is a function", function() {
        //     expect(typeof reg.googleLogin).toBe('function');
        // });
        // it("reg.facebookLogin is a function", function() {
        //     expect(typeof reg.facebookLogin).toBe('function');
        // });
        // it("reg.twitterLogin is a function", function() {
        //     expect(typeof reg.twitterLogin).toBe('function');
        // });
    });
}(angular));
