'use strict';

describe("afEntity Service=>FB Tests", function() {
    describe('$firebaseArray methods', function() {

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

        var arr, $firebaseArray, $utils, $timeout, testutils, mockArr;
        beforeEach(function() {
            module('utils.afApi');
            module('fbMocks');
            module('testutils');
            inject(function(_$firebaseArray_, $firebaseUtils, _$timeout_, _testutils_, _mockArr_){
                testutils = _testutils_;
                $timeout = _$timeout_;
                $firebaseArray = _$firebaseArray_;
                $utils = $firebaseUtils;
								mockArr = _mockArr_;
                arr = stubArray(STUB_DATA);
            });
        });

        describe('<constructor>', function() {
            beforeEach(function() {
                inject(function($firebaseUtils, $firebaseArray) {
                    this.$utils = $firebaseUtils;
                    this.$firebaseArray = $firebaseArray;
                });
            });

            it('should return a valid array', function() {
                expect(Array.isArray(arr)).toBe(true);
            });

            it('should have API methods', function() {
                var i = 0;
                this.$utils.getPublicMethods($firebaseArray, function(v, k) {
                    expect(typeof arr[k]).toBe('function');
                    i++;
                });
                expect(i).toBeGreaterThan(0);
            });
        });

        describe('$add', function() {
            it('should call $push on $firebase', function() {
                var spy = spyOn(arr.$ref(), 'push').and.callThrough();
                var data = {
                    foo: 'bar'
                };
                arr.$add(data);
                expect(spy).toHaveBeenCalled();
            });

            it('should return a promise', function() {
                expect(arr.$add({
                    foo: 'bar'
                })).toBeAPromise();
            });

            it('should resolve to ref for new record', function() {
                var spy = jasmine.createSpy();
                arr.$add({
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
                arr = extendArray(null, $firebaseArray.$extend({
                    $$added: addPromise
                }));
                expect(arr.length).toBe(0);
                arr.$add({
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

            it('should wait to resolve $loaded until $$added promise is resolved', function() {
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
                var called = false;
								var ref = stubRef();
                arr = extendArray(null, $firebaseArray.$extend({
                    $$added: addPromise
                }),ref);
                arr.$loaded().then(function() {
                    expect(arr.length).toBe(1);
                    called = true;
                });
                ref.set({
                    '-Jwgx': {
                        username: 'James',
                        email: 'james@internet.com'
                    }
                });
                ref.flush();
                $timeout.flush();
                queue[0]('James');
                $timeout.flush();
                expect(called, 'called').toBe(true);
            });


            it('should reject promise on fail', function() {
                var successSpy = jasmine.createSpy('resolve spy');
                var errSpy = jasmine.createSpy('reject spy');
                var err = new Error('fail_push');
                arr.$ref().failNext('push', err);
                arr.$add('its deed').then(successSpy, errSpy);
                flushAll(arr.$ref());
                expect(successSpy).not.toHaveBeenCalled();
                expect(errSpy).toHaveBeenCalledWith(err);
            });

            it('should work with a primitive value', function() {
                var spyPush = spyOn(arr.$ref(), 'push').and.callThrough();
                var spy = jasmine.createSpy('$add').and.callFake(function(ref) {
                    expect(arr.$ref().child(ref.key()).getData()).toEqual('hello');
                });
                arr.$add('hello').then(spy);
                flushAll(arr.$ref());
                expect(spyPush).toHaveBeenCalled();
                expect(spy).toHaveBeenCalled();
            });

            it('should throw error if array is destroyed', function() {
                arr.$destroy();
                expect(function() {
                    arr.$add({
                        foo: 'bar'
                    });
                }).toThrowError(Error);
            });

            it('should store priorities', function() {
                var arr = stubArray();
                addAndProcess(arr, testutils.snap('one', 'b', 1), null);
                addAndProcess(arr, testutils.snap('two', 'a', 2), 'b');
                addAndProcess(arr, testutils.snap('three', 'd', 3), 'd');
                addAndProcess(arr, testutils.snap('four', 'c', 4), 'c');
                addAndProcess(arr, testutils.snap('five', 'e', 5), 'e');
                expect(arr.length).toBe(5);
                for (var i = 1; i <= 5; i++) {
                    expect(arr[i - 1].$priority).toBe(i);
                }
            });

            it('should observe $priority and $value meta keys if present', function() {
                var spy = jasmine.createSpy('$add').and.callFake(function(ref) {
                    expect(ref.priority).toBe(99);
                    expect(ref.getData()).toBe('foo');
                });
                var arr = stubArray();
                arr.$add({
                    $value: 'foo',
                    $priority: 99
                }).then(spy);
                flushAll(arr.$ref());
                expect(spy).toHaveBeenCalled();
            });

            it('should work on a query', function() {
                var ref = stubRef();
                var query = ref.limit(2);
                var arr = stubArray(); // stubArray(null, query);
                addAndProcess(arr, testutils.snap('one', 'b', 1), null);
                expect(arr.length).toBe(1);
            });
        });


        describe('$watch', function() {
            it('should get notified when $$notify is called', function() {
                var spy = jasmine.createSpy('$watch');
                arr.$watch(spy);
                arr.$$notify('child_removed', 'removedkey123', 'prevkey456');
                expect(spy).toHaveBeenCalledWith({
                    event: 'child_removed',
                    key: 'removedkey123',
                    prevChild: 'prevkey456'
                });
            });

            it('should return a dispose function', function() {
                expect(arr.$watch(function() {})).toBeA('function');
            });

            it('should not get notified after dispose function is called', function() {
                var spy = jasmine.createSpy('$watch');
                var off = arr.$watch(spy);
                off();
                arr.$$notify('child_removed', 'removedkey123', 'prevkey456');
                expect(spy).not.toHaveBeenCalled();
            });

            it('calling the deregistration function twice should be silently ignored', function() {
                var spy = jasmine.createSpy('$watch');
                var off = arr.$watch(spy);
                off();
                off();
                arr.$$notify('child_removed', 'removedkey123', 'prevkey456');
                expect(spy).not.toHaveBeenCalled();
            });
        });
       
        describe('$$added', function() {
            it('should return an object', function() {
                var snap = testutils.snap({
                    foo: 'bar'
                }, 'newObj');
                var res = arr.$$added(snap);
                expect(res).toEqual(jasmine.objectContaining({
                    foo: 'bar'
                }));
            });

            it('should return false if key already exists', function() {
                var snap = testutils.snap({
                    foo: 'bar'
                }, 'a');
                var res = arr.$$added(snap);
                expect(res).toBe(false);
            });

            it('should accept a primitive', function() {
                var res = arr.$$added(testutils.snap(true, 'newPrimitive'), null);
                expect(res.$value).toBe(true);
            });

            it('should apply $$defaults if they exist', function() {
                var arr = extendArray(null, $firebaseArray.$extend({
                    $$defaults: {
                        aString: 'not_applied',
                        foo: 'foo'
                    }
                }));
                var res = arr.$$added(testutils.snap(STUB_DATA.a));
                expect(res.aString).toBe(STUB_DATA.a.aString);
                expect(res.foo).toBe('foo');
            });
        });

        describe('$$updated', function() {
            it('should return true if data changes', function() {
                var res = arr.$$updated(testutils.snap('foo', 'b'));
                expect(res).toBe(true);
            });

            it('should return false if data does not change', function() {
                var i = arr.$indexFor('b');
                var res = arr.$$updated(testutils.snap(arr[i], 'b'));
                expect(res).toBe(false);
            });

            it('should update local data', function() {
                var i = arr.$indexFor('b');
                expect(i).toBeGreaterThan(-1);
                arr.$$updated(testutils.snap('foo', 'b'));
                expect(arr[i]).toEqual(jasmine.objectContaining({
                    '$value': 'foo'
                }));
            });

            it('should ignore if not found', function() {
                var len = arr.length;
                expect(len).toBeGreaterThan(0);
                var copy = testutils.deepCopyObject(arr);
                arr.$$updated(testutils.snap('foo', 'notarealkey'));
                expect(len).toEqual(copy.length);
                for (var i = 0; i < len; i++) {
                    expect(arr[i]).toEqual(copy[i]);
                }
            });

            it('should preserve ids', function() {
                var pos = arr.$indexFor('b');
                expect(pos).toBeGreaterThan(-1);
                arr.$$updated(testutils.snap({
                    foo: 'bar'
                }, 'b'));
                expect(arr[pos].$id).toBe('b');
            });

            it('should set priorities', function() {
                var pos = arr.$indexFor('b');
                expect(pos).toBeGreaterThan(-1);
                arr.$$updated(testutils.snap({
                    foo: 'bar'
                }, 'b', 250));
                expect(arr[pos].$priority).toBe(250);
            });

            it('should apply $$defaults if they exist', function() {
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$defaults: {
                        aString: 'not_applied',
                        foo: 'foo'
                    }
                }));
                var rec = arr.$getRecord('a');
                expect(rec.aString).toBe(STUB_DATA.a.aString);
                expect(rec.foo).toBe('foo');
                delete rec.foo;
                arr.$$updated(testutils.snap($utils.toJSON(rec), 'a'));
                expect(rec.aString).toBe(STUB_DATA.a.aString);
                expect(rec.foo).toBe('foo');
            });
        });

        describe('$$moved', function() {
            it('should set $priority', function() {
                var rec = arr.$getRecord('c');
                expect(rec.$priority).not.toBe(999);
                arr.$$moved(testutils.snap($utils.toJSON(rec), 'c', 999), 'd');
                expect(rec.$priority).toBe(999);
            });

            it('should return true if record exists', function() {
                var rec = arr.$getRecord('a');
                var res = arr.$$moved(testutils.snap($utils.toJSON(rec), 'a'), 'c');
                expect(res).toBe(true);
            });

            it('should return false record not found', function() {
                var res = arr.$$moved(testutils.snap(true, 'notarecord'), 'c');
                expect(res).toBe(false);
            });
        });

        describe('$$removed', function() {
            it('should return true if exists in data', function() {
                var res = arr.$$removed(testutils.snap(null, 'e'));
                expect(res).toBe(true);
            });

            it('should return false if does not exist in data', function() {
                var res = arr.$$removed(testutils.snap(null, 'notarecord'));
                expect(res).toBe(false);
            });
        });

        describe('$$error', function() {
            it('should call $destroy', function() {
                var spy = jasmine.createSpy('$destroy');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $destroy: spy
                }));
                spy.calls.reset();
                arr.$$error('test_err');
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('$$notify', function() {
            it('should notify $watch listeners', function() {
                var spy1 = jasmine.createSpy('$watch1');
                var spy2 = jasmine.createSpy('$watch2');
                arr.$watch(spy1);
                arr.$watch(spy2);
                arr.$$notify('added', 'e', 'd');
                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();
            });

            it('should pass an object containing key, event, and prevChild if present', function() {
                var spy = jasmine.createSpy('$watch1');
                arr.$watch(spy);
                arr.$$notify('child_added', 'e', 'd');
                expect(spy).toHaveBeenCalledWith({
                    event: 'child_added',
                    key: 'e',
                    prevChild: 'd'
                });
            });
        });

        describe('$$process', function() {

            /////////////// ADD
            it('should add to local array', function() {
                var len = arr.length;
                var rec = arr.$$added(testutils.snap({
                    hello: 'world'
                }, 'addz'), 'b');
                arr.$$process('child_added', rec, 'b');
                expect(arr.length).toBe(len + 1);
            });

            it('should position after prev child', function() {
                var pos = arr.$indexFor('b');
                expect(pos).toBeGreaterThan(-1);
                var rec = arr.$$added(testutils.snap({
                    hello: 'world'
                }, 'addAfterB'), 'b');
                arr.$$process('child_added', rec, 'b');
                expect(arr.$keyAt(pos + 1)).toBe('addAfterB');
            });

            it('should position first if prevChild is null', function() {
                var rec = arr.$$added(testutils.snap({
                    hello: 'world'
                }, 'addFirst'), null);
                arr.$$process('child_added', rec, null);
                expect(arr.$keyAt(0)).toBe('addFirst');
            });

            it('should position last if prevChild not found', function() {
                var len = arr.length;
                var rec = arr.$$added(testutils.snap({
                    hello: 'world'
                }, 'addLast'), 'notarealkeyinarray');
                arr.$$process('child_added', rec, 'notrealkeyinarray');
                expect(arr.$keyAt(len)).toBe('addLast');
            });

            it('should invoke $$notify with "child_added" event', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                spy.calls.reset();
                var rec = arr.$$added(testutils.snap({
                    hello: 'world'
                }, 'addFirst'), null);
                arr.$$process('child_added', rec, null);
                expect(spy).toHaveBeenCalled();
            });

            it('"child_added" should not invoke $$notify if it already exists after prevChild', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                var index = arr.$indexFor('e');
                var prevChild = arr.$$getKey(arr[index - 1]);
                spy.calls.reset();
                arr.$$process('child_added', arr.$getRecord('e'), prevChild);
                expect(spy).not.toHaveBeenCalled();
            });

            ///////////////// UPDATE

            it('should invoke $$notify with "child_changed" event', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                spy.calls.reset();
                arr.$$updated(testutils.snap({
                    hello: 'world'
                }, 'a'));
                arr.$$process('child_changed', arr.$getRecord('a'));
                expect(spy).toHaveBeenCalled();
            });

            ///////////////// MOVE
            it('should move local record', function() {
                var b = arr.$indexFor('b');
                var c = arr.$indexFor('c');
                arr.$$moved(testutils.refSnap(testutils.ref('b')), 'c');
                arr.$$process('child_moved', arr.$getRecord('b'), 'c');
                expect(arr.$indexFor('c')).toBe(b);
                expect(arr.$indexFor('b')).toBe(c);
            });

            it('should position at 0 if prevChild is null', function() {
                var b = arr.$indexFor('b');
                expect(b).toBeGreaterThan(0);
                arr.$$moved(testutils.snap(null, 'b'), null);
                arr.$$process('child_moved', arr.$getRecord('b'), null);
                expect(arr.$indexFor('b')).toBe(0);
            });

            it('should position at end if prevChild not found', function() {
                var b = arr.$indexFor('b');
                expect(b).toBeLessThan(arr.length - 1);
                arr.$$moved(testutils.refSnap(testutils.ref('b')), 'notarealkey');
                arr.$$process('child_moved', arr.$getRecord('b'), 'notarealkey');
                expect(arr.$indexFor('b')).toBe(arr.length - 1);
            });

            it('should invoke $$notify with "child_moved" event', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                spy.calls.reset();
                arr.$$moved(testutils.refSnap(testutils.ref('b')), 'notarealkey');
                arr.$$process('child_moved', arr.$getRecord('b'), 'notarealkey');
                expect(spy).toHaveBeenCalled();
            });

            it('"child_moved" should not trigger $$notify if prevChild is already the previous element', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                var index = arr.$indexFor('e');
                var prevChild = arr.$$getKey(arr[index - 1]);
                spy.calls.reset();
                arr.$$process('child_moved', arr.$getRecord('e'), prevChild);
                expect(spy).not.toHaveBeenCalled();
            });

            ///////////////// REMOVE
            it('should remove from local array', function() {
                var len = arr.length;
                expect(arr.$indexFor('b')).toBe(1);
                arr.$$removed(testutils.refSnap(testutils.ref('b')));
                arr.$$process('child_removed', arr.$getRecord('b'));
                expect(arr.length).toBe(len - 1);
                expect(arr.$indexFor('b')).toBe(-1);
            });

            it('should trigger $$notify with "child_removed" event', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                spy.calls.reset();
                arr.$$removed(testutils.refSnap(testutils.ref('e')));
                arr.$$process('child_removed', arr.$getRecord('e'));
                expect(spy).toHaveBeenCalled();
            });

            it('"child_removed" should not trigger $$notify if the record is not in the array', function() {
                var spy = jasmine.createSpy('$$notify');
                var arr = extendArray(STUB_DATA, $firebaseArray.$extend({
                    $$notify: spy
                }));
                spy.calls.reset();
                arr.$$process('child_removed', {
                    $id: 'f'
                });
                expect(spy).not.toHaveBeenCalled();
            });

            //////////////// OTHER
            it('should throw an error for an unknown event type', function() {
                var arr = stubArray(STUB_DATA);
                expect(function() {
                    arr.$$process('unknown_event', arr.$getRecord('e'));
                }).toThrow();
            });

        });

        describe('$extend', function() {
            it('should return a valid array', function() {
                var F = $firebaseArray.$extend({});
                expect(Array.isArray(F(stubRef()))).toBe(true);
            });

            it('should preserve child prototype', function() {
                function Extend() {
                    $firebaseArray.apply(this, arguments);
                }
                Extend.prototype.foo = function() {};
                $firebaseArray.$extend(Extend);
                var arr = new Extend(stubRef());
                expect(typeof(arr.foo)).toBe('function');
            });

            it('should return child class', function() {
                function A() {}
                var res = $firebaseArray.$extend(A);
                expect(res).toBe(A);
            });

            it('should be instanceof $firebaseArray', function() {
                function A() {}
                $firebaseArray.$extend(A);
                expect(new A(stubRef()) instanceof $firebaseArray).toBe(true);
            });

            it('should add on methods passed into function', function() {
                function foo() {
                    return 'foo';
                }
                var F = $firebaseArray.$extend({
                    foo: foo
                });
                var res = F(stubRef());
                expect(typeof res.$$updated).toBe('function');
                expect(typeof res.foo).toBe('function');
                expect(res.foo()).toBe('foo');
            });

            it('should work with the new keyword', function() {
                var fn = function() {};
                var Res = $firebaseArray.$extend({
                    foo: fn
                });
                expect(new Res(stubRef()).foo).toBeA('function');
            });

            it('should work without the new keyword', function() {
                var fn = function() {};
                var Res = $firebaseArray.$extend({
                    foo: fn
                });
                expect(Res(stubRef()).foo).toBeA('function');
            });
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

        function stubRef() {
					return mockArr.stubRef();
        }

        function stubArray(initialData, factory, ref) {
					return mockArr.stubArray(initialData, factory, ref);
        }
        function extendArray(initialData, Factory, ref) {
					return mockArr.extendArray(initialData, Factory, ref);
        }


        function addAndProcess(arr, snap, prevChild) {
            arr.$$process('child_added', arr.$$added(snap, prevChild), prevChild);
        }

    });
});
