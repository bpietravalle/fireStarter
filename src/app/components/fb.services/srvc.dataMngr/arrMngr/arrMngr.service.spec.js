(function() {
    "use strict";
    describe('arrMngr', function() {
        var arr, ref, $utils, $timeout, testutils, mockArr, arrMngr;

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
            module('srvc.dataMngr');
            module('fbMocks');
            module('testutils');
            inject(function($firebaseUtils, _$timeout_, _arrMngr_, _testutils_, _mockArr_) {
                testutils = _testutils_;
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

            // it('should accept an item from the array', function() {
            //     var key = arr.$keyAt(2);
            //     var spy = spyOn(arr.$ref().child(key), 'set');
            //     arr[2].number = 99;
            //     arr.$save(arr[2]);
            //     var expResult = $utils.toJSON(arr[2]);
            //     expect(spy).toHaveBeenCalledWith(expResult, jasmine.any(Function));
            // });

            // it('should return a promise', function() {
            //     expect(arr.$save(1)).toBeAPromise();
            // });

            // it('should resolve promise on sync', function() {
            //     var spy = jasmine.createSpy();
            //     arr.$save(1).then(spy);
            //     expect(spy).not.toHaveBeenCalled();
            //     flushAll(arr.$ref());
            //     expect(spy).toHaveBeenCalled();
            // });

            // it('should reject promise on failure', function() {
            //     var key = arr.$keyAt(1);
            //     var err = new Error('test_reject');
            //     arr.$ref().child(key).failNext('set', err);
            //     var whiteSpy = jasmine.createSpy('resolve');
            //     var blackSpy = jasmine.createSpy('reject');
            //     arr.$save(1).then(whiteSpy, blackSpy);
            //     flushAll(arr.$ref());
            //     expect(whiteSpy).not.toHaveBeenCalled();
            //     expect(blackSpy).toHaveBeenCalledWith(err);
            // });

            // it('should reject promise on bad index', function() {
            //     var whiteSpy = jasmine.createSpy('resolve');
            //     var blackSpy = jasmine.createSpy('reject');
            //     arr.$save(99).then(whiteSpy, blackSpy);
            //     flushAll();
            //     expect(whiteSpy).not.toHaveBeenCalled();
            //     expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
            // });

            // it('should reject promise on bad object', function() {
            //     var whiteSpy = jasmine.createSpy('resolve');
            //     var blackSpy = jasmine.createSpy('reject');
            //     arr.$save({
            //         foo: 'baz'
            //     }).then(whiteSpy, blackSpy);
            //     flushAll();
            //     expect(whiteSpy).not.toHaveBeenCalled();
            //     expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
            // });

            // it('should accept a primitive', function() {
            //     var key = arr.$keyAt(1);
            //     var ref = arr.$ref().child(key);
            //     arr[1] = {
            //         $value: 'happy',
            //         $id: key
            //     };
            //     arr.$save(1);
            //     flushAll(ref);
            //     expect(ref.getData()).toBe('happy');
            // });

            // it('should throw error if object is destroyed', function() {
            //     arr.$destroy();
            //     expect(function() {
            //         arr.$save(0);
            //     }).toThrowError(Error);
            // });

            // it('should trigger watch event', function() {
            //     var spy = jasmine.createSpy('$watch');
            //     arr.$watch(spy);
            //     var key = arr.$keyAt(1);
            //     arr[1].foo = 'watchtest';
            //     arr.$save(1);
            //     flushAll(arr.$ref());
            //     expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
            //         event: 'child_changed',
            //         key: key
            //     }));
            // });

            // it('should work on a query', function() {
            //     var whiteSpy = jasmine.createSpy('resolve');
            //     var blackSpy = jasmine.createSpy('reject').and.callFake(function(e) {
            //         console.error(e);
            //     });
            //     var ref = stubRef();
            //     ref.set(STUB_DATA);
            //     ref.flush();
            //     var query = ref.limit(5);
            //     var arr = stubArray(null, query);
            //     flushAll(arr.$ref());
            //     var key = arr.$keyAt(1);
            //     arr[1].foo = 'watchtest';
            //     arr.$save(1).then(whiteSpy, blackSpy);
            //     flushAll(arr.$ref());
            //     expect(whiteSpy).toHaveBeenCalled();
            //     expect(blackSpy).not.toHaveBeenCalled();
            // });
        });


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
                }
            })();
    });
})();
