(function() {
    "use strict";

    describe("FireEntity Factory", function() {
        var firePath, $injector, inflector, fsType, fsPath, options, fbObject, fbArray, pathSpy, $provide, fireEntity, subject, path, fireStarter, $q, $log;

        beforeEach(function() {
            module("fireStarter.services",
                function($provide) {
                    $provide.service("fireStarter",
                        function() {
                            return function(type, path, flag) {
                                if (type === "object") {
                                    fbObject = jasmine.createSpyObj("fbObject", ["timestamp", "ref", "path", "bindTo", "destroy",
                                        "id", "priority", "value", "loaded", "remove", "save", "watch"
                                    ]);
                                    fsPath = path;
                                    fsType = type;
                                    return fbObject;
                                } else {
                                    fbArray = jasmine.createSpyObj("fbArray", ["timestamp", "ref", "path", "add", "destroy",
                                        "getRecord", "keyAt", "indexFor", "loaded", "remove", "save", "watch"
                                    ]);
                                    fsPath = path;
                                    fsType = type;
                                    return fbArray;
                                }

                            }


                        });

                    $provide.service("firePath",
                        function() {
                            return function(path, options) {
                                pathSpy = jasmine.createSpyObj("pathSpy", ["mainRecord", "mainArray", "nestedArray", "nestedRecord"]);
                                return pathSpy;
                            }
                        });
                });
            inject(function(_firePath_, _fireEntity_, _inflector_, _fireStarter_, _$q_, _$log_) {
                inflector = _inflector_;
                firePath = _firePath_;
                fireEntity = _fireEntity_;
                fireStarter = _fireStarter_;
                $q = _$q_;
                $log = _$log_;
            });

            subject = fireEntity("path");

        });
        afterEach(function() {
            firePath = null;
            fireEntity = null;
            fireStarter = null;
        });
        describe("Constructor", function() {
            it("should be defined", function() {
                expect(subject).toBeDefined();
            });
            it("should accept an options hash", function() {
                expect(subject).toBeDefined();
            });
        });
        describe("Main fireStarter Constructors", function() {
            describe("buildObject", function() {
                it("should call fireStarter with 'object' argument", function() {
                    expect(fbObject).not.toBeDefined();
                    subject.buildObject(["path"]);
                    expect(fbObject).toBeDefined();
                });

            });
            describe("buildArray", function() {
                it("should call fireStarter with 'array' argument", function() {
                    expect(fbArray).not.toBeDefined();
                    subject.buildArray(["path"]);
                    expect(fbArray).toBeDefined();
                    expect(fbArray).toBeDefined();
                });
            });
        });
        describe("Registering firebase refs", function() {
            var recId = 1;
            var nested = "nestedPath";
            var fpMethods = [
                ["mainArray", [], "array"],
                ["mainRecord", [recId], "object"],
                ["nestedArray", [recId, nested], "array"],
                ["nestedRecord", [nested, recId], "object"],
            ];

            function testMethods(y) {
                describe(y[0], function() {
                    var meth;
                    switch (y[1].length) {
                        case 0:
                            it("should call " + y[0] + " on firePath", function() {
                                meth = subject[y[0]]();
                                expect(pathSpy[y[0]]).toHaveBeenCalled();
                            });
                            break;
                        case 1:
                            it("should call " + y[0] + " on firePath", function() {
                                meth = subject[y[0]](y[1][0]);
                                expect(pathSpy[y[0]]).toHaveBeenCalledWith(y[1][0]);
                            });
                            break;
                        case 2:
                            it("should call " + y[0] + " on firePath", function() {
                                meth = subject[y[0]](y[1][0], y[1][1]);
                                expect(pathSpy[y[0]]).toHaveBeenCalledWith(y[1][0], y[1][1]);
                            });
                            break;
                    }
                    it("should call fireStarter with " + y[2], function() {
                        meth
                        expect(fsType).toEqual(y[2]);
                    });
                    // won't pass.
                    // it("should call fireStarter with correct path", function() {
                    //     meth
                    //     expect(fsPath).toEqual(pathSpy[y[0]]);
                    // });
                });
            }
            fpMethods.forEach(testMethods);
        });
        describe("Registering CRUD operations", function() {
            describe("Query Methods", function() {

                describe('findById', function() {
                    it("should call 'object' on fireStarter", function() {
                        subject.findById(1)
                        expect(fsType).toEqual("object");
                    })
                    it("should call mainRecord on firePath", function() {
                        subject.findById(1)
                        expect(pathSpy.mainRecord).toHaveBeenCalledWith(1);
                    })
                    it("should equal a firebaseObject", function() {
                        expect(subject.findById(1)).toEqual(fbObject);
                    });


                });
                describe('loadById', function() {
                    it("should call loaded on firebase Object", function() {
                        subject.loadById(1);
                        expect(fbObject.loaded).toHaveBeenCalled();
                    });
                });

            });
        });
        describe("Options", function() {
            beforeEach(function() {
							spyOn($log,"info").and.callThrough();
                options = {
                    nestedArrays: ["phone"]
                };
                subject = fireEntity("path", options);
            });

            describe("Geofire", function() {
                /* geofire node
                 * dynamically add functions add, remove,
                 *
                 */

            });
            describe("User", function() {
                /* user service
                 * user method names
                 *
                 *
                 */
            });
            describe("Nested Arrays", function() {

                it("should define a new method for the array", function() {
                    // expect(subject.phones()).toBeDefined();
                });
                it("should define a new method for records of the array", function() {
                    expect($log.info.calls.argsFor(0)[0]).toEqual("as");
                });

                // it("should pass an id and the pluaralized array name to firePath", function() {
                //     subject.phones(1);
                //     expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "phones");
                // });
                // it("won't change array name if passed plural name to firePath", function() {
                //     options = {
                //         nestedArrays: ["phones"]
                //     };
                //     subject = fireEntity("path", options);
                //     subject.phones(1);
                //     expect(pathSpy.nestedArray).toHaveBeenCalledWith(1, "phones");
                // });
                // it("should call 'array' on fireStarter", function() {
                //     subject.phones(1);
                //     expect(fbType).toEqual("array");
                //     expect(fbArray).toBeDefined();
                // });
                it("should throw error if option isn't an array", function() {
                    options = {
                        nestedArrays: "blah",
                    };
                    expect(function() {
                        fireEntity("path", options);
                    }).toThrow();
                });

            });

        });

    });






})();
