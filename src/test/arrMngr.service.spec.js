(function() {
    "use strict";
    describe('arrMngr', function() {
        var arr, $log, $q, deferred,$rootScope, newData, newArr, ref, $utils, $timeout, testutils, mockArr, arrMngr, $firebaseArray;

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
            inject(function(_$log_, _$q_, $firebaseUtils, _$rootScope_,_$timeout_, _arrMngr_, _testutils_, _mockArr_, _$firebaseArray_) {
                testutils = _testutils_;
                $q = _$q_;
								$rootScope = _$rootScope_;
                $log = _$log_;
                $firebaseArray = _$firebaseArray_;
                $timeout = _$timeout_;
                $utils = $firebaseUtils;
                arrMngr = _arrMngr_;
                mockArr = _mockArr_;
                ref = mockArr.stubRef();
                arr = mockArr.stubArray(STUB_DATA);
            });
        });
        describe('ref', function() {
            it('should return Firebase instance it was created with', function() {
                var arr = mockArr.stubArray(null, ref);
                expect(arrMngr.ref(arr)).toBe(ref);
            });
        });
        describe("UpdateRecord", function() {
            beforeEach(function() {
                newData = {
                    aNumber: 5,
                    aString: 'gamma'
                };
                spyOn($q, "reject").and.callThrough();
                spyOn(arrMngr, "save").and.callThrough();
            });
            describe("Implementing $q.when", function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callThrough();
                });

                it("should call $q.when with only one arg", function() {
                    arrMngr.updateRecord(arr, newData);
                    expect($q.when.calls.count()).toEqual(1);
                });
                it("should be called with updated record", function() {
                    arrMngr.updateRecord(arr, newData);
                    expect($q.when.calls.argsFor(0)).not.toEqual(arr);
                });
            });

            describe("Stubbing $q.when", function() {
                beforeEach(function() {
                    newArr = mockArr.stubArray(newData, ref);
                    spyOn($q, "when").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                describe("When $q.when resolves", function() {
                    beforeEach(function() {
                        arrMngr.updateRecord(arr, newData);
                        deferred.resolve(newArr);
                        $rootScope.$digest();
                    });
                    it("should call save with the updated record", function() {
                        expect(arrMngr.save).toHaveBeenCalledWith(newArr);
                    });
                });
                describe("When $q.when is rejected", function() {
                    beforeEach(function() {
                        arrMngr.updateRecord(arr, newData);
                        deferred.reject("error");
                        $rootScope.$digest();
                    });
                    it("should not call save with the updated record", function() {
                        expect(arrMngr.save).not.toHaveBeenCalledWith(newArr);
                    });
                    it("should call $q.reject with the error", function() {
                        expect($q.reject).toHaveBeenCalledWith("error");
                    });

                });
            });

        });

        describe('load', function() {
            it('should return a promise', function() {
                expect(arrMngr.load(arr)).toBeAPromise();
            });

            it('should resolve when values are received', function() {
                var arr = mockArr.stubArray();
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                arrMngr.load(arr).then(whiteSpy, blackSpy);
                flushAll();
                expect(whiteSpy).not.toHaveBeenCalled();
                flushAll(arr.$ref());
                expect(whiteSpy).toHaveBeenCalled();
                expect(blackSpy).not.toHaveBeenCalled();
            });

            it('should resolve to the array', function() {
                var spy = jasmine.createSpy('resolve');
                arrMngr.load(arr).then(spy);
                flushAll();
                expect(spy).toHaveBeenCalledWith(arr);
            });

            it('should have all data loaded when it resolves', function() {
                var spy = jasmine.createSpy('resolve');
                arrMngr.load(arr).then(spy);
                flushAll();
                var list = spy.calls.argsFor(0)[0];
                expect(list.length).toBe(5);
            });

            it('should reject when error fetching records', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var err = new Error('test_fail');
                ref.failNext('on', err);
                var arr = mockArr.stubArray(null, ref);
                arrMngr.load(arr).then(whiteSpy, blackSpy);
                flushAll(ref);
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy).toHaveBeenCalledWith(err);
            });

            it('should resolve if function passed directly into $loaded', function() {
                var spy = jasmine.createSpy('resolve');
                var res = {
                    success: spy,
                    failure: null
                };
                arrMngr.load(arr, res);
                flushAll();
                expect(spy).toHaveBeenCalledWith(arr);
            });

            it('should reject properly when function passed directly into $loaded', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var err = new Error('test_fail');
                ref.failNext('once', err);
                var arr = mockArr.stubArray(null, ref);
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.load(arr, res);
                flushAll(ref);
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy).toHaveBeenCalledWith(err);
            });

        });

        describe('remove', function() {
            it('should call remove on Firebase ref', function() {
                var key = arr.$keyAt(1);
                var spy = spyOn(arr.$ref().child(key), 'remove');
                arrMngr.remove(arr, 1);
                expect(spy).toHaveBeenCalled();
            });

            it('should return a promise', function() {
                expect(arrMngr.remove(arr, 1)).toBeAPromise();
            });

            it('should resolve promise to ref on success when results passed in', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var expName = arr.$keyAt(1);
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.remove(arr, 1, res);
                flushAll(arr.$ref());
                var resRef = whiteSpy.calls.argsFor(0)[0];
                expect(whiteSpy).toHaveBeenCalled();
                expect(resRef).toBeAFirebaseRef();
                expect(resRef.key()).toBe(expName);
                expect(blackSpy).not.toHaveBeenCalled();
            });

            it('should reject promise on failure when results passed in', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var key = arr.$keyAt(1);
                var err = new Error('fail_remove');
                arr.$ref().child(key).failNext('remove', err);
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.remove(arr, 1, res);
                flushAll(arr.$ref());
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy).toHaveBeenCalledWith(err);
            });

            it('should reject promise if bad int', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.remove(arr, -99, res);
                flushAll();
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
            });

            it('should reject promise if bad object', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.remove(arr, {
                    foo: "boom"
                }, res);
                flushAll();
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
            });

            it('should work on a query', function() {
                ref.set(STUB_DATA);
                ref.flush();
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject').and.callFake(function(e) {
                    console.error(e);
                });
                var query = ref.limit(5); //todo-mock MockFirebase does not support 2.x queries yet
                var arr = mockArr.stubArray(null, query);
                flushAll(arr.$ref());
                var key = arr.$keyAt(1);
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.remove(arr, 1, res);
                flushAll(arr.$ref());
                expect(whiteSpy).toHaveBeenCalled();
                expect(blackSpy).not.toHaveBeenCalled();
            });

            it('should throw Error if array destroyed', function() {
                arr.$destroy();
                expect(function() {
                    arrMngr.remove(arr, 0);
                }).toThrowError(Error);
            });
        });

        describe('$save', function() {
            it('should accept an array index', function() {
                var key = arr.$keyAt(2);
                var spy = spyOn(arr.$ref().child(key), 'set');
                arr[2].number = 99;
                arrMngr.save(arr, 2);
                var expResult = $utils.toJSON(arr[2]);
                expect(spy).toHaveBeenCalledWith(expResult, jasmine.any(Function));
            });

            it('should accept an item from the array', function() {
                var key = arr.$keyAt(2);
                var spy = spyOn(arr.$ref().child(key), 'set');
                arr[2].number = 99;
                arrMngr.save(arr, arr[2]);
                var expResult = $utils.toJSON(arr[2]);
                expect(spy).toHaveBeenCalledWith(expResult, jasmine.any(Function));
            });

            it('should return a promise', function() {
                expect(arrMngr.save(arr, 1)).toBeAPromise();
            });

            it('should resolve promise on sync when result passed in', function() {
                var spy = jasmine.createSpy();
                var res = {
                    success: spy,
                    failure: null
                };
                arrMngr.save(arr, 1, res);
                expect(spy).not.toHaveBeenCalled();
                flushAll(arr.$ref());
                expect(spy).toHaveBeenCalled();
            });

            it('should reject promise on failure', function() {
                var key = arr.$keyAt(1);
                var err = new Error('test_reject');
                arr.$ref().child(key).failNext('set', err);
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.save(arr, 1, res);
                flushAll(arr.$ref());
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy).toHaveBeenCalledWith(err);
            });

            it('should reject promise on bad index', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.save(arr, 99, res);
                flushAll();
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
            });

            it('should reject promise on bad object', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.save(arr, {
                    foo: 'baz'
                }, res);
                flushAll();
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
            });

            it('should accept a primitive', function() {
                var key = arr.$keyAt(1);
                var ref = arr.$ref().child(key);
                arr[1] = {
                    $value: 'happy',
                    $id: key
                };
                arrMngr.save(arr, 1);
                flushAll(ref);
                expect(ref.getData()).toBe('happy');
            });

            it('should throw error if object is destroyed', function() {
                arr.$destroy();
                expect(function() {
                    arrMngr.save(arr, 0);
                }).toThrowError(Error);
            });

            it('should trigger watch event', function() {
                var spy = jasmine.createSpy('$watch');
                arr.$watch(spy);
                var key = arr.$keyAt(1);
                arr[1].foo = 'watchtest';
                arrMngr.save(arr, 1);
                flushAll(arr.$ref());
                expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
                    event: 'child_changed',
                    key: key
                }));
            });

            it('should work on a query', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject').and.callFake(function(e) {
                    console.error(e);
                });
                ref.set(STUB_DATA);
                ref.flush();
                var query = ref.limit(5);
                var arr = mockArr.stubArray(null, query);
                flushAll(arr.$ref());
                var key = arr.$keyAt(1);
                arr[1].foo = 'watchtest';
                var res = {
                    success: whiteSpy,
                    failure: blackSpy
                };
                arrMngr.save(arr, 1, res);
                flushAll(arr.$ref());
                expect(whiteSpy).toHaveBeenCalled();
                expect(blackSpy).not.toHaveBeenCalled();
            });
        });

        describe('destroy', function() {
            it('should call off on ref', function() {
                var spy = spyOn(arr.$ref(), 'off');
                arrMngr.destroy(arr);
                expect(spy).toHaveBeenCalled();
            });

            it('should empty the array', function() {
                expect(arr.length).toBeGreaterThan(0);
                arrMngr.destroy(arr);
                expect(arr.length).toBe(0);
            });

            it('should reject $loaded() if not completed yet', function() {
                var whiteSpy = jasmine.createSpy('resolve');
                var blackSpy = jasmine.createSpy('reject');
                var arr = mockArr.stubArray();
                arr.$loaded().then(whiteSpy, blackSpy);
                arrMngr.destroy(arr);
                flushAll(arr.$ref());
                expect(whiteSpy).not.toHaveBeenCalled();
                expect(blackSpy.calls.argsFor(0)[0]).toMatch(/destroyed/i);
            });
        });
        describe('key', function() {
            it('should return key for an integer', function() {
                expect(arrMngr.key(arr, 2)).toBe('c');
            });

            it('should return key for an object', function() {
                expect(arrMngr.key(arr, 2)).toBe('c');
            });

            it('should return null if invalid object', function() {
                expect(arrMngr.key(arr, {
                    foo: false
                })).toBe(null);
            });

            it('should return null if invalid integer', function() {
                expect(arrMngr.key(arr, -99)).toBe(null);
            });
        });

        describe('indexFor', function() {
            it('should return integer for valid key', function() {
                expect(arrMngr.index(arr, 'c')).toBe(2);
            });

            it('should return -1 for invalid key', function() {
                expect(arrMngr.index(arr, 'notarealkey')).toBe(-1);
            });

            it('should not show up after removing the item', function() {
                var rec = arr.$getRecord('b');
                expect(rec).not.toBe(null);
                arr.$$removed(testutils.refSnap(testutils.ref('b')));
                arr.$$process('child_removed', rec);
                expect(arrMngr.index(arr, 'b')).toBe(-1);
            });
        });
        describe('get', function() {
            it("should find the correct record", function() {
                var test = arrMngr.get(arr, 'c');
                expect(test).toEqual({
                    aString: 'charlie',
                    aNumber: 3,
                    aBoolean: true,
                    $id: 'c',
                    $priority: null
                });
            });
            it("should return null if record doesn't exist", function() {
                var test = arrMngr.get(arr, 'asdsdc');
                expect(test).toEqual(null);

            });
        });
        describe('add', function() {
            it('should call $push on $firebase', function() {
                var spy = spyOn(arr.$ref(), 'push').and.callThrough();
                var data = {
                    foo: 'bar'
                };
                arrMngr.add(arr, data);
                expect(spy).toHaveBeenCalled();
            });

            it('should return a promise', function() {
                expect(arrMngr.add(arr, {
                    foo: 'bar'
                })).toBeAPromise();
            });

            it('should resolve to ref for new record', function() {
                var spy = jasmine.createSpy();
                arrMngr.add(arr, {
                    foo: 'bar'
                }).then(spy);
                flushAll(arr.$ref());
                var lastId = arr.$ref()._lastAutoId;
                expect(spy).toHaveBeenCalledWith(arr.$ref().child(lastId));
            });

            it('should wait for promise resolution to update array', function() {
                var queue = [];

                function addPromise(snap, prevChild) {
                        return new $utils.promise(
                            function(resolve) {
                                queue.push(resolve);
                            }).then(function(name) {
                            var data = $firebaseArray.prototype.$$added.call(arr, snap, prevChild);
                            data.name = name;
                            return data;
                        });
                    }
                    //change this to afEntity.
                arr = mockArr.extendArray(null, $firebaseArray.$extend({
                    $$added: addPromise
                }));
                expect(arr.length).toBe(0);
                arrMngr.add(arr, {
                    userId: '1234'
                });
                flushAll(arr.$ref());
                expect(arr.length).toBe(0);
                expect(queue.length).toBe(1);
                queue[0]('James');
                $timeout.flush();
                expect(arr.length).toBe(1);
                expect(arr[0].name).toBe('James');
            });

            // this doesn't test arrMngr.add...remove
            // it('should wait to resolve $loaded until $$added promise is resolved', function() {
            //     var queue = [];

            //     function addPromise(snap, prevChild) {
            //         return new $utils.promise(
            //             function(resolve) {
            //                 queue.push(resolve);
            //             }).then(function(name) {
            //             var data = $firebaseArray.prototype.$$added.call(arr, snap, prevChild);
            //             data.name = name;
            //             return data;
            //         });
            //     }
            //     var called = false;
            //     arr = mockArr.extendArray(null, $firebaseArray.$extend({
            //         $$added: addPromise
            //     }), ref);
            //     arr.$loaded().then(function() {
            //         expect(arr.length).toBe(1);
            //         called = true;
            //     });
            //     ref.set({
            //         '-Jwgx': {
            //             username: 'James',
            //             email: 'james@internet.com'
            //         }
            //     });
            //     ref.flush();
            //     $timeout.flush();
            //     queue[0]('James');
            //     $timeout.flush();
            //     expect(called, 'called').toBe(true);
            // });


            it('should reject promise on fail', function() {
                var successSpy = jasmine.createSpy('resolve spy');
                var errSpy = jasmine.createSpy('reject spy');
                var err = new Error('fail_push');
                arr.$ref().failNext('push', err);
                var res = {
                    success: successSpy,
                    failure: errSpy
                };
                arrMngr.add(arr, 'its deed', res);
                flushAll(arr.$ref());
                expect(successSpy).not.toHaveBeenCalled();
                expect(errSpy).toHaveBeenCalledWith(err);
            });

            it('should work with a primitive value', function() {
                var spyPush = spyOn(arr.$ref(), 'push').and.callThrough();
                var spy = jasmine.createSpy('$add').and.callFake(function(ref) {
                    expect(arr.$ref().child(ref.key()).getData()).toEqual('hello');
                });
                var res = {
                    success: spy,
                    failure: null
                };
                arrMngr.add(arr, 'hello', res);
                flushAll(arr.$ref());
                expect(spyPush).toHaveBeenCalled();
                expect(spy).toHaveBeenCalled();
            });

            it('should throw error if array is destroyed', function() {
                arr.$destroy();
                expect(function() {
                    arrMngr.add(arr, {
                        foo: 'bar'
                    });
                }).toThrowError(Error);
            });

            //not testing arrMngr.add()
            // it('should store priorities', function() {
            //     var arr = mockArr.stubArray();
            //     addAndProcess(arr, testutils.snap('one', 'b', 1), null);
            //     addAndProcess(arr, testutils.snap('two', 'a', 2), 'b');
            //     addAndProcess(arr, testutils.snap('three', 'd', 3), 'd');
            //     addAndProcess(arr, testutils.snap('four', 'c', 4), 'c');
            //     addAndProcess(arr, testutils.snap('five', 'e', 5), 'e');
            //     expect(arr.length).toBe(5);
            //     for (var i = 1; i <= 5; i++) {
            //         expect(arr[i - 1].$priority).toBe(i);
            //     }
            // });

            it('should observe $priority and $value meta keys if present', function() {
                var spy = jasmine.createSpy('$add').and.callFake(function(ref) {
                    expect(ref.priority).toBe(99);
                    expect(ref.getData()).toBe('foo');
                });
                var arr = mockArr.stubArray();
                var res = {
                    success: spy,
                    failure: null
                };
                arrMngr.add(arr, {
                    $value: 'foo',
                    $priority: 99
                }, res);
                flushAll(arr.$ref());
                expect(spy).toHaveBeenCalled();
            });

            //not testing arrMngr.add()
            // it('should work on a query', function() {
            //     var query = ref.limit(2);
            //     var arr = mockArr.stubArray(); // stubArray(null, query);
            //     addAndProcess(arr, testutils.snap('one', 'b', 1), null);
            //     expect(arr.length).toBe(1);
            // });
        });

        function addAndProcess(arr, snap, prevChild) {
            arr.$$process('child_added', arr.$$added(snap, prevChild), prevChild);
        }

        var flushAll =
            (function() {
                return function flushAll() {
                    // the order of these flush events is significant
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
