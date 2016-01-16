(function() {
    'use strict';
    var module;
    describe("firebase.starter Module:", function() {
        beforeEach(function() {
            module = angular.module("firebase.starter");
        });

        it("should exist", function() {
            expect(module).toBeDefined();
        });
        describe("Dependencies:", function() {
            var deps;
            var hasModule = function(m) {
                return deps.indexOf(m) >= 0;
            };
            beforeEach(function() {
                deps = module.value('firebase.starter').requires;
            });
            it("should depend on firebase", function() {
                expect(hasModule("firebase")).toBeTruthy();
            });
        });
    });
})();


