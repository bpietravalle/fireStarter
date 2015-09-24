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

        newData = {

            aString: 'hello',
            aNumber: 6
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
            });
        });
        describe("FirebaseArray API Wrapper", function() {
            beforeEach(function() {
                arr = mockArr.stubArray(STUB_DATA, ref);
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
            describe('keyAt', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    recId = 'a';
                    deferred.resolve(arr);
                    mockRecord = mockArr.mockRecord(arr, recId);
                    arrMngr.keyAt(path, mockRecord);
                });
                it('should call build with path', function() {
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.keyAt(path, mockRecord);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$keyAt").and.callThrough();
                        $rootScope.$digest();
                    });
                    it("should call $keyAt with correct record", function() {
                        expect(deferred.promise.$$state.value.$keyAt).toHaveBeenCalledWith(mockRecord);
                    });

                    it('should return correct value wrapped in a promise', function() {
                        var test = arrMngr.keyAt(path, mockRecord);
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
            describe('loaded', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    recId = 'a';
                    deferred.resolve(arr);
                    arrMngr.loaded(path);
                });
                it('should call build with path', function() {
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.loaded(path);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$loaded").and.callThrough();
                        $rootScope.$digest();
                    });
                    it('should return correct value wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(arr);
                    });
                    it("should call $loaded with correct record", function() {
                        expect(deferred.promise.$$state.value.$loaded).toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.loaded(path, mockRecord);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject with error", function() {
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
                });
                it('should call build with path', function() {
                    arrMngr.save(path, mockRecord);
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        this.index = arr.$indexFor(recId);
                        mockRecord.aString = "new_string";
                        arrMngr.save(path, mockRecord);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$save").and.callThrough();
                        $rootScope.$digest();
                    });
                    it('should update the value of the correct record', function() {
                        expect(deferred.promise.$$state.value[this.index].aString).toEqual("new_string");
                    });
                    it("should call $save with correct record", function() {
                        expect(deferred.promise.$$state.value.$save).toHaveBeenCalledWith(mockRecord);
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
            describe('remove', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    recId = 'a';
                    deferred.resolve(arr);
                    mockRecord = mockArr.mockRecord(arr, recId);
                });
                it('should call build with path', function() {
                    arrMngr.remove(path, mockRecord);
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    //Note required cycles 
                    beforeEach(function() {
                        arrMngr.remove(path, mockRecord);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$remove").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        ref.flush(); //mockfb
                        $rootScope.$digest(); //promise 2 return value
                    });
                    it('should delete the correct record', function() {
                        expect(deferred.promise.$$state.value.length).toEqual(4);
                    });
                    it("should call $remove with correct record", function() {
                        expect(deferred.promise.$$state.value.$remove).toHaveBeenCalledWith(mockRecord);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.remove(path, mockRecord);
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
            describe('destroy', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    recId = 'a';
                });
                it('should call build with path', function() {
                    arrMngr.destroy(path);
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    //Note required cycles 
                    beforeEach(function() {
                        arrMngr.destroy(path);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$destroy").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        $rootScope.$digest(); //promise 2 return value
                    });
                    it('should delete all records in the local array', function() {
                        expect(deferred.promise.$$state.value.length).toEqual(0);
                    });
                    it("should call $destroy with correct path", function() {
                        expect(deferred.promise.$$state.value.$destroy).toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.destroy(path);
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
            describe('getRecord', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    recId = 'a';
                });
                it('should call build with path', function() {
                    arrMngr.getRecord(path, recId);
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.getRecord(path, recId);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$getRecord");
                        $rootScope.$digest(); //promise 1
                    });
                    it('should call $getRecord with key', function() {
                        expect(deferred.promise.$$state.value.$getRecord).toHaveBeenCalledWith(recId);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.getRecord(path, recId);
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
            describe('indexFor', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    recId = 'a';
                });
                it('should call build with path', function() {
                    arrMngr.indexFor(path, recId);
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.indexFor(path, recId);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$indexFor");
                        $rootScope.$digest(); //promise 1
                    });
                    it('should call $indexFor with key', function() {
                        expect(deferred.promise.$$state.value.$indexFor).toHaveBeenCalledWith(recId);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.indexFor(path, recId);
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
            describe('add', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call build with path', function() {
                    arrMngr.add(path, newData);
                    expect(arrMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.add(path, newData);
                        deferred.resolve(arr);
                        spyOn(deferred.promise.$$state.value, "$add").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        ref.flush();
                        $rootScope.$digest();
                    });
                    it('should call $add with the new record', function() {
                        expect(deferred.promise.$$state.value.$add).toHaveBeenCalledWith(newData);
                    });
                    it('should add a new record to the array', function() {
                        expect(deferred.promise.$$state.value.length).toEqual(6);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        arrMngr.add(path, newData);
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
            })
        });


        describe("Added functions", function() {
            // describe("updateNestedArray", function() {});
            describe("GetNestedKey", function() {
                beforeEach(function() {
                    spyOn($q, "reject")
                    spyOn(arrMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    data = {
                        'a': {
                            type: "cell",
                            number: "1234567",
                            phone_id: "fkeyA"
                        },
                        'b': {
                            type: "work",
                            number: "9871234",
                            phone_id: "fkeyB"
                        },
                        'c': {
                            type: "home",
                            number: "0000000",
                            phone_id: "fkeyC"
                        }
                    };
                    arr = mockArr.stubArray(data, ref);
                });
                describe("build() Resolved: ", function() {
                    it("should return a promise", function() {
                        var test = arrMngr.getNestedKey("fkeyA", "phone_id", path);
                        deferred.resolve(arr);
                        $rootScope.$digest();
                        expect(test).toBeAPromise();
                    });
                    it("should set the correct nestedKey", function() {
                        var test = arrMngr.getNestedKey("fkeyB", "phone_id", path);
                        deferred.resolve(arr);
                        $rootScope.$digest();
                        expect(test.$$state.value).toEqual('b');
                    });
                    it("should throw an error if no key/val pair found", function() {
                        expect(function() {
                            arrMngr.getNestedKey("fkeyA", "address_id", path);
                            deferred.resolve(arr);
                            $rootScope.$digest();
                        }).toThrow();
                    });
                    it("should not call $q.reject", function() {
                        expect($q.reject).not.toHaveBeenCalled();
                    });

                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        error = "Error!";
                        arrMngr.getNestedKey("fkeyA", "phone_id", path);
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

            });
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

        });

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
