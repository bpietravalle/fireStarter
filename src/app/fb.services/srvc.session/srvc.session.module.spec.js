(function(angular) {
    'use strict';
    var module;
    describe("fb.srvc.session Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.srvc.session");
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
                deps = module.value('fb.srvc.session').requires;
            });
            it("should depend on LocalStorageModule", function() {
                expect(hasModule('LocalStorageModule')).toBeTruthy();
            });
        });
    });
})(angular);
