(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        var firePath, options, fireEntity, entity, path, fireStarter, $q, $log;

        beforeEach(function() {
            module("fireStarter.services");
            inject(function(_firePath_, _fireEntity_, _fireStarter_, _$q_, _$log_) {
                firePath = _firePath_;
                fireEntity = _fireEntity_;
                fireStarter = _fireStarter_;
                $q = _$q_;
                $log = _$log_;
                entity = fireEntity("path");
            });

        });
        describe("Constructor", function() {
            it("should be defined", function() {
                expect(entity).toBeDefined();
            });
            it("should accept an options hash", function() {
                expect(entity).toBeDefined();
            });


        });





    });






})();
