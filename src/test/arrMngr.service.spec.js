(function() {
    "use strict";
    describe('arrMngr', function() {
        var arr, afEntity, error, path, fkey, col, mockRecord, recId, data, $log, $q, deferred1, deferred, $rootScope, newData, newArr, ref, mockArr, arrMngr;

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
            module('fireStarter.services');
            module('fbMocks');
            module('testutils');
            path = ["users", "1", "phones"];
            inject(function(_$log_, _$q_, _afEntity_, _$rootScope_, _arrMngr_, _mockArr_) {
                afEntity = _afEntity_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $log = _$log_;
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
                    spyOn(arr, "$save").and.callThrough();
                    recId = 'a';
                    mockRecord = mockArr.mockRecord(arr, recId);
                });
                it('should call $save with array and record', function() {
                    arrMngr.save(arr, mockRecord);
                    expect(arr.$save).toHaveBeenCalledWith(mockRecord);
                });
								it("should not call $q.reject", function(){
                    arrMngr.save(arr, mockRecord);
                    $rootScope.$digest();
                    ref.flush();
                    expect($q.reject).not.toHaveBeenCalled();
								});
                it('should call build with path', function() {
                    mockRecord.aNumber = newData.aNumber;
                    mockRecord.aString = newData.aString;
                    arrMngr.save(arr, mockRecord);
                    $rootScope.$digest();
                    ref.flush();
                    expect(mockRecord.aNumber).toEqual(newData.aNumber);
                    expect(mockRecord.aString).toEqual(newData.aString);
                });
                // describe("build() Rejected: ", function() {
                //     beforeEach(function() {
                //         arrMngr.save(path, mockRecord);
                //         error = "Error!";
                //         deferred.reject(error);
                //         $rootScope.$digest();
                //     });
                //     it('should return correct error wrapped in a promise', function() {
                //         expect(deferred.promise.$$state.value).toEqual(error);
                //     });
                //     it("should call $q.reject", function() {
                //         expect($q.reject).toHaveBeenCalledWith(error);
                //     });
                // });
            });
            describe('remove', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    recId = 'a';
                    spyOn(arr, "$remove").and.callThrough();
                    mockRecord = mockArr.mockRecord(arr, recId);
                });
                it('should call $remove with array and record', function() {
                    arrMngr.remove(arr, mockRecord);
                    expect(arr.$remove).toHaveBeenCalledWith(mockRecord);
                });
                it('should delete the correct record', function() {
                    arrMngr.remove(arr, mockRecord);
                    $rootScope.$digest();
                    ref.flush();
                    expect(mockRecord).not.toBe();
                });
								it("should not call $q.reject", function(){
                    arrMngr.remove(arr, mockRecord);
                    $rootScope.$digest();
                    ref.flush();
                    expect($q.reject).not.toHaveBeenCalled();
								});

                // describe("build() Rejected: ", function() {
                //     beforeEach(function() {
                //         arrMngr.remove(path, mockRecord);
                //         error = "Error!";
                //         deferred.reject(error);
                //         $rootScope.$digest();
                //     });
                //     it('should return correct error wrapped in a promise', function() {
                //         expect(deferred.promise.$$state.value).toEqual(error);
                //     });
                //     it("should call $q.reject", function() {
                //         expect($q.reject).toHaveBeenCalledWith(error);
                //     });
                // });
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
                    spyOn($q, "all").and.callThrough();

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
                        spyOn(deferred.promise.$$state.value, "$getRecord").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        // deferred1.resolve("success");
                    });
                    it('should call $getRecord with key', function() {
                        expect(deferred.promise.$$state.value.$getRecord).toHaveBeenCalledWith(recId);
                    });
                    it('should return object with array', function() {
                        expect(deferred.promise.$$state.value).toEqual(arr);
                    });
                    it('should return object with correct record', function() {
                        expect(deferred.promise.$$state.value[0]).toEqual(jasmine.objectContaining({

                            $id: 'a',
                            aString: 'alpha',
                            aNumber: 1,
                            aBoolean: false
                        }));
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
            });

        });

        describe("Added functions", function() {
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

            });
            // describe("UpdateRecord", function() {
            //     beforeEach(function() {
            //         spyOn($q, "reject")
            //         spyOn(arrMngr, "getRecord").and.callFake(function() {
            //             deferred = $q.defer();
            //             return deferred.promise;
            //         });
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
            //         recId = 'a';
            //         arr = mockArr.stubArray(data, ref);
            //         mockRecord = mockArr.mockRecord(arr, recId);
            //         newData = {
            //             aNumber: 5,
            //             aString: 'gamma'
            //         };
            //     });
            // describe("build() Resolved: ", function() {
            //     beforeEach(function() {
            //         spyOn(arrMngr, "save").and.callThrough();
            //         arrMngr.updateRecord(arr, mockRecord, newData);
            //         deferred.resolve(mockRecord);
            //         $rootScope.$digest();
            //         $rootScope.$digest();
            //     });

            //     it("should return the correct record wrapped in a promise", function() {
            //         expect(deferred.promise.$$state.value).toEqual(mockRecord);
            //     });
            //     it("should call arrMngr.save with updated record and path", function() {
            //         expect(arrMngr.save).toHaveBeenCalledWith(arr, mockRecord);
            //         expect(arrMngr.save.calls.argsFor(0)[1].aString).toEqual("gamma");
            //         expect(arrMngr.save.calls.argsFor(0)[1].aNumber).toEqual(5);
            //     });
            //     it("should not call $q.reject", function() {
            //         expect($q.reject).not.toHaveBeenCalled();
            //     });
            // });
            // describe("build() Rejected: ", function() {
            //     beforeEach(function() {
            //         error = "Error!";
            //         arrMngr.updateRecord(arr, mockRecord, newData);
            //         deferred.reject(error);
            //         $rootScope.$digest();
            //     });
            //     it('should return correct error wrapped in a promise', function() {
            //         expect(deferred.promise.$$state.value).toEqual(error);
            //     });
            //     it("should call $q.reject", function() {
            //         expect($q.reject).toHaveBeenCalledWith(error);
            //     });
            // });



            // });
            describe("updateNestedArray", function() {
                beforeEach(function() {
                    spyOn($q, "reject")
                    spyOn(arrMngr, "getNestedKey").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    spyOn(arrMngr, "updateRecord").and.callFake(function() {
                        deferred1 = $q.defer();
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
                    fkey = "fkeyA";
                    col = "phone_id";
                    recId = 'a';
                    arr = mockArr.stubArray(data, ref);
                    mockRecord = mockArr.mockRecord(arr, recId);
                    newData = {
                        number: "202-202-1111",
                        type: 'fax'
                    };
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        arrMngr.updateNestedArray(fkey, col, path, newData);
                        deferred.resolve(recId);
                        $rootScope.$digest();
                        deferred1.resolve(ref);
                        $rootScope.$digest();
                        $rootScope.$digest();
                    });

                    it("should return the correct Id wrapped in a promise", function() {
                        expect(deferred.promise.$$state.value).toEqual(recId);
                    });
                    it("should call getNestedKey with path and and fkey value and column", function() {
                        expect(arrMngr.getNestedKey.calls.argsFor(0)[0]).toEqual("fkeyA");
                        expect(arrMngr.getNestedKey.calls.argsFor(0)[1]).toEqual("phone_id");
                        expect(arrMngr.getNestedKey.calls.argsFor(0)[2]).toEqual(path);
                    });
                    it("should call arrMngr.updateRecord with path correct recId and data", function() {
                        expect(arrMngr.updateRecord.calls.argsFor(0)[0]).toEqual(path);
                        expect(arrMngr.updateRecord.calls.argsFor(0)[1]).toEqual(recId);
                        expect(arrMngr.updateRecord.calls.argsFor(0)[2]).toEqual(newData);
                    });
                    it("should not call $q.reject", function() {
                        expect($q.reject).not.toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        error = "Error!";
                        arrMngr.updateNestedArray(fkey, col, path, newData);
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
