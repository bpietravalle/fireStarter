(function() {
    "use strict";
    describe('arrMngr', function() {
        var arr, afEntity, error, path, mockRecord, recId, data, $log, $q, deferred, $rootScope, newData, newArr, ref, $utils, $timeout, testutils, mockArr, arrMngr, $firebaseArray;

        var STUB_DATA = {
            'a': {
                aString: 'alpha',
                aNumber: 1,
                aBoolean: false
            },
            'b': {
                aString: 'bravo',
                aNumber: 2,
                aBoolean: true
            },
            'c': {
                aString: 'charlie',
                aNumber: 3,
                aBoolean: true
            },
            'd': {
                aString: 'delta',
                aNumber: 4,
                aBoolean: true
            },
            'e': {
                aString: 'echo',
                aNumber: 5
            }
        };

        beforeEach(function() {
            module('fb.srvc.dataMngr');
            module('fbMocks');
            module('testutils');
            path = ["users", "1", "phones"];
            inject(function(_$log_, _$q_, _afEntity_, $firebaseUtils, _$rootScope_, _$timeout_, _arrMngr_, _testutils_, _mockArr_) {
                afEntity = _afEntity_;
                testutils = _testutils_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $timeout = _$timeout_;
                $utils = $firebaseUtils;
                arrMngr = _arrMngr_;
                mockArr = _mockArr_;
                ref = mockArr.refWithPath(path);
                arr = mockArr.stubArray(STUB_DATA, ref);
            });
        });
        describe('build', function() {
            beforeEach(function() {
                spyOn($q, "reject");
                spyOn(afEntity, "set").and.returnValue(arr);
            });
            describe("Implementing $q.when", function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callThrough();
                    arrMngr.build(path)
                });
                it('should call $q.when 1 time', function() {
                    expect($q.when.calls.count()).toEqual(1);
                });
                it("should call afEntity with path", function() {
                    expect(afEntity.set.calls.argsFor(0)[1]).toEqual(path);
                });
                it('should call $q.when with correct array', function() {
                    expect($q.when).toHaveBeenCalledWith(arr);
                });
                it('should return the array wrapped in a promise', function() {
                    var test = arrMngr.build(path)

                    $rootScope.$digest();
                    expect(test.$$state.value).toEqual(arr);
                });

            });
            describe("Stubbing $q.when: ", function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                describe("$q.when Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.build(path)
                        deferred.resolve(arr);
                        $rootScope.$digest();
                    });
                    it('should return correct value wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(arr);
                    });
                });
                describe("$q.when Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.build(path)
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
        });
        describe('key', function() {
            beforeEach(function() {
                spyOn($q, "reject");
                spyOn(arrMngr, "build").and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });
                recId = 'a';
                deferred.resolve(arr);
                mockRecord = mockArr.mockRecord(arr, recId);
                arrMngr.key(path, mockRecord);
            });
            it('should call build with path', function() {
                expect(arrMngr.build).toHaveBeenCalledWith(path);
            });
            describe("build() Resolved: ", function() {
                beforeEach(function() {
                    deferred.resolve(arr);
                    $rootScope.$digest();
                });
                it('should return correct value wrapped in a promise', function() {
                    var test = arrMngr.key(path, mockRecord);
                    deferred.resolve(arr);
                    $rootScope.$digest();
                    expect(test.$$state.value).toEqual(recId);
                });
            });
            describe("build() Rejected: ", function() {
                beforeEach(function() {
                    error = "Error!";
                    deferred.reject(error);
                    $rootScope.$digest();
                });
                it('should return correct error wrapped in a promise', function() {
                    expect(deferred.promise.$$state.value).toEqual(error);
                });
                it("should call $q.reject", function() {
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });
        describe('ref', function() {
            beforeEach(function() {
                spyOn($q, "reject");
                spyOn($q, "when").and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });
                arrMngr.ref(arr)
            });
            it('should call $q.when 1 time', function() {
                expect($q.when.calls.count()).toEqual(1);
            });
            it('should call $q.when with arrays ref', function() {
                expect($q.when).toHaveBeenCalledWith(ref);
            });
            describe("$q.when Resolved: ", function() {
                beforeEach(function() {
                    deferred.resolve(ref);
                    $rootScope.$digest();
                });
                it('should return correct value wrapped in a promise', function() {
                    expect(deferred.promise.$$state.value).toEqual(ref);
                });
            });
            describe("$q.when Rejected: ", function() {
                beforeEach(function() {
                    arrMngr.ref(arr)
                    error = "Error!";
                    deferred.reject(error);
                    $rootScope.$digest();
                });
                it('should return correct error wrapped in a promise', function() {
                    expect(deferred.promise.$$state.value).toEqual(error);
                });
                it("should call $q.reject", function() {
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });
        describe('load', function() {
            beforeEach(function() {
                spyOn($q, "reject");
                spyOn(arrMngr, "build").and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });
                recId = 'a';
                deferred.resolve(arr);
                mockRecord = mockArr.mockRecord(arr, recId);
                arrMngr.load(path, mockRecord);
            });
            it('should call build with path', function() {
                expect(arrMngr.build).toHaveBeenCalledWith(path);
            });
            describe("build() Resolved: ", function() {
                beforeEach(function() {
                    deferred.resolve(arr);
                    $rootScope.$digest();
                });
                it('should return correct value wrapped in a promise', function() {
                    var test = arrMngr.load(path);
                    deferred.resolve(arr);
                    $rootScope.$digest();
                    expect(test.$$state.value).toEqual(arr);
                });
            });
            describe("build() Rejected: ", function() {
                beforeEach(function() {
                    arrMngr.load(path, mockRecord);
                    error = "Error!";
                    deferred.reject(error);
                    $rootScope.$digest();
                });
                it('should return correct error wrapped in a promise', function() {
                    expect(deferred.promise.$$state.value).toEqual(error);
                });
                it("should call $q.reject", function() {
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });
        describe('save', function() {
            beforeEach(function() {
                spyOn($q, "reject");
                spyOn(arrMngr, "build").and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });
                recId = 'a';
                deferred.resolve(arr);
                mockRecord = mockArr.mockRecord(arr, recId);
                arrMngr.save(path, mockRecord);
            });
            it('should call build with path', function() {
                expect(arrMngr.build).toHaveBeenCalledWith(path);
            });
            describe("build() Resolved: ", function() {
                beforeEach(function() {
                    mockRecord.aString = "new_string";
                    arrMngr.save(path, mockRecord);
                    deferred.resolve(arr);
                    $rootScope.$digest();
                });
                it('should update the value of the correct record', function() {
        //     it('should accept an array index', function() {
        //         var key = arr.$keyAt(2);
        //         var spy = spyOn(arr.$ref().child(key), 'set');
        //         arr[2].number = 99;
        //         arrMngr.save(arr, 2);
        //         var expResult = $utils.toJSON(arr[2]);
        //         expect(spy).toHaveBeenCalledWith(expResult, jasmine.any(Function));
        //     });
                    $rootScope.$digest();
										flushAll();
                    expect(deferred.promise.$$state.value.$keyAt(1)).toEqual(jasmine.objectContaining({ aString: "new_string"}));
                });
            });
            describe("build() Rejected: ", function() {
                beforeEach(function() {
                    arrMngr.save(path, mockRecord);
                    error = "Error!";
                    deferred.reject(error);
                    $rootScope.$digest();
                });
                it('should return correct error wrapped in a promise', function() {
                    expect(deferred.promise.$$state.value).toEqual(error);
                });
                it("should call $q.reject", function() {
                    expect($q.reject).toHaveBeenCalledWith(error);
                });
            });
        });

        // describe("updateNestedArray", function() {});
        // describe("GetNestedKey", function() {
        //     beforeEach(function() {
        //         path = "users/1/phones";
        //         data = {
        //             'a': {
        //                 type: "cell",
        //                 number: "1234567",
        //                 phone_id: "fkeyA"
        //             },
        //             'b': {
        //                 type: "work",
        //                 number: "9871234",
        //                 phone_id: "fkeyB"
        //             },
        //             'c': {
        //                 type: "home",
        //                 number: "0000000",
        //                 phone_id: "fkeyC"
        //             }
        //         };
        //         spyOn($q, "reject");
        //         this.arr = mockArr.nestedMock(data, path);
        //         spyOn(afEntity, "set").and.returnValue(this.arr);
        //     });
        // describe("Implementing $q.when", function() {
        //     beforeEach(function() {
        //         spyOn($q, "when").and.callThrough();
        //     });
        //     it("should return a promise", function() {
        //         var test = arrMngr.getNestedKey("fkeyA", "phone_id", path);
        //         $rootScope.$digest();
        //         expect(test).toBeAPromise();
        //     });
        //     it("should set the correct nestedKey", function() {
        //         var test = arrMngr.getNestedKey("fkeyA", "phone_id", path);
        //         $rootScope.$digest();
        //         expect(test.$$state.value).toEqual('a');
        //     });
        //     it("should throw an error if no key/val pair found", function() {
        //         expect(function() {
        //             var test = arrMngr.getNestedKey("fkeyA", "address_id", path);
        //             $rootScope.$digest();
        //             expect(test).toEqual('a');
        //         }).toThrow();
        //     });

        // });

        // describe("Stubbing $q.when", function() {
        //     beforeEach(function() {
        //         spyOn($q, "when").and.callFake(function() {
        //             deferred = $q.defer();
        //             return deferred.promise;
        //         });
        //     });
        //     describe("When $q.when resolves", function() {
        //         beforeEach(function() {
        //             arrMngr.getNestedKey("fkeyA", "phone_id", path);
        //             deferred.resolve("a");
        //             $rootScope.$digest();
        //         });

        //         it("should return the value", function() {
        //             expect(deferred.promise.$$state.value).toEqual("a");
        //         });
        //         it("should not call $q.reject", function() {
        //             expect($q.reject).not.toHaveBeenCalled();
        //         });
        //     });

        //     describe("When $q.when is rejected", function() {
        //         beforeEach(function() {
        //             arrMngr.getNestedKey("fkeyA", "phone_id", path);
        //             deferred.reject("error");
        //             $rootScope.$digest();
        //         });
        //         it("should call $q.reject", function() {
        //             expect($q.reject.calls.count()).toEqual(1);
        //         });
        //         it("should return the error message", function() {
        //             expect(deferred.promise.$$state.value).toEqual("error");
        //         });

        //     });

        // });
        // });
        // describe("UpdateRecord", function() {
        // beforeEach(function() {
        //     recId = 5;
        //     path = ["string"];
        //     newData = {
        //         aNumber: 5,
        //         aString: 'gamma'
        //     };
        //     spyOn($q, "reject");
        //     spyOn(arrMngr, "save");
        //     spyOn(afEntity, "set").and.returnValue(arr);
        // });
        // describe("Implementing $q.when", function() {
        //     beforeEach(function() {
        //         spyOn($q, "when").and.callThrough();
        //         arrMngr.updateRecord(path, recId, newData);
        //     });
        //     it("should call $q.when three times", function() {
        //         expect($q.when.calls.count()).toEqual(2);
        //     });
        //     describe("On First call", function() {
        //         it("should be called first with updated record", function() {
        //             expect($q.when.calls.argsFor(0)).not.toEqual(arr);
        //         });
        //         it("should pass path to array", function() {
        //             expect(afEntity.set.calls.argsFor(0)[1]).toEqual(path);
        //         });
        //     });
        // });

        // describe("Stubbing $q.when", function() {
        //     beforeEach(function() {
        //         newArr = mockArr.stubArray(newData, ref);
        //         spyOn($q, "when").and.callFake(function() {
        //             deferred = $q.defer();
        //             return deferred.promise;
        //         });
        //         arrMngr.updateRecord(path, recId, newData);
        //     });
        //     describe("When $q.when resolves", function() {
        //         beforeEach(function() {
        //             deferred.resolve(newArr);
        //             $rootScope.$digest();
        //         });
        //         it("should call save with the updated record", function() {
        //             expect(arrMngr.save.calls.argsFor(0)[1]).toEqual(newArr);
        //         });
        //         it("should call save with the correct path", function() {
        //             expect(arrMngr.save.calls.argsFor(0)[0]).toEqual(path);
        //         });
        //     });
        //     describe("When $q.when is rejected", function() {
        //         beforeEach(function() {
        //             deferred.reject("error");
        //             $rootScope.$digest();
        //         });
        //         it("should not call save with the updated record", function() {
        //             expect(arrMngr.save).not.toHaveBeenCalledWith(newArr);
        //         });
        //         it("should call $q.reject with the error", function() {
        //             expect($q.reject).toHaveBeenCalledWith("error");
        //         });

        //     });
        // });

        // });

        function addAndProcess(arr, snap, prevChild) {
            arr.$$process('child_added', arr.$$added(snap, prevChild), prevChild);
        }

        var flushAll =
            (function() {
                return function flushAll() {
                    Array.prototype.slice.call(arguments, 0).forEach(function(o) {
                        o.flush();
                    });
                    try {
                        $timeout.flush();
                    } catch (e) {}
                };
            })();
    });
})();
