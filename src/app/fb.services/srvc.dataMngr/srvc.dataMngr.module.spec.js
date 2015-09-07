(function(angular) {
    'use strict';
    var module;
    describe("fb.srvc.dataMngr Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.srvc.dataMngr");
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
                deps = module.value('fb.srvc.dataMngr').requires;
            });
            it("should depend on fb.utils", function() {
                expect(hasModule('fb.utils')).toBeTruthy();
            });
        });
    });
})(angular);

