describe("Config", function() {
    var testFactory, geoFactory, rootFactory, rootPath;
    describe("Invalid Config - without setting rootPath", function() {
        it("should throw error", function() {
            expect(function() {
                angular.module("test", ["firebase.starter"])
                    .factory("testFactory", ["fireStarter",
                        function(fireStarter) {
                            return fireStarter("ref", ["main"]);
                        }
                    ]);
                module("test");
                inject(function(_testFactory_) {
                    testFactory = _testFactory_;
                });
            });
        });
    });
    describe("With Valid Config", function() {
        beforeEach(function() {
            rootPath = "http://your-path.io";
            angular.module("test", ["firebase.starter"])
                .factory("rootFactory", ["fireStarter",
                    function(fireStarter) {
                        return fireStarter("ref", ["main"]);
                    }
                ])
                .factory("geoFactory", ["fireStarter",
                    function(fireStarter) {
                        return fireStarter("geo", ["main"]);
                    }
                ])
                .factory("testFactory", ["fireStarter",
                    function(fireStarter) {
                        return fireStarter("object", ["main"]);
                    }
                ])
                .config(function(fireStarterProvider) {
                    fireStarterProvider.setRoot(rootPath);
                });

            module("test");
            inject(function(_testFactory_, _rootFactory_,_geoFactory_) {
                geoFactory = _geoFactory_;
                rootFactory = _rootFactory_;
                testFactory = _testFactory_;
            });
        });

        it("should be defined", function() {
            expect(testFactory).toBeDefined();
            expect(rootFactory).toBeDefined();
        });
        it("should have the correct path/ref", function() {
            expect(rootFactory).toBeAFirebaseRef();
            expect(rootFactory.key()).toEqual("main");
            expect(testFactory.$id).toEqual("main");
            expect(testFactory.$ref().root().toString()).toEqual(rootPath);
            expect(rootFactory.root().toString()).toEqual(rootPath);
        });
    });
});

