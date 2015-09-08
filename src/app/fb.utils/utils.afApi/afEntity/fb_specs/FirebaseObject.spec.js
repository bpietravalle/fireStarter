'use strict';
describe("afEntity Service=>FB Tests", function() {
    describe('$firebaseObject', function() {
        var $firebaseObject, $utils, $rootScope, $timeout, obj, testutils, $interval, log, mockObj;

        var DEFAULT_ID = 'REC1';
        var FIXTURE_DATA = {
            aString: 'alpha',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'bravo'
            }
        };

        beforeEach(function() {
            log = {
                error: []
            };

            module('utils.afApi');
            module('fbMocks');
            module('testutils', function($provide) {
                $provide.value('$log', {
                    error: function() {
                        log.error.push(Array.prototype.slice.call(arguments));
                    }
                })
            });
            inject(function(_$interval_, _$firebaseObject_, _$timeout_, $firebaseUtils, _$rootScope_, _testutils_, _mockObj_) {
                $firebaseObject = _$firebaseObject_;
                $timeout = _$timeout_;
                $interval = _$interval_;
                $utils = $firebaseUtils;
                $rootScope = _$rootScope_;
                testutils = _testutils_;
                mockObj = _mockObj_;

                // start using the direct methods here until we can refactor `obj`
                obj = makeObject(FIXTURE_DATA);
            });
        });

        describe('constructor', function() {
            // it('should set the record id', function() {
            //     expect(obj.$id).toEqual(obj.$ref().key());
            // });

            it('should accept a query', function() {
                var obj = makeObject(FIXTURE_DATA, stubRef().limit(1).startAt(null));
                flushAll();
                obj.$$updated(testutils.snap({
                    foo: 'bar'
                }));
                expect(obj).toEqual(jasmine.objectContaining({
                    foo: 'bar'
                }));
            });

            it('should apply $$defaults if they exist', function() {
                var F = $firebaseObject.$extend({
                    $$defaults: {
                        aNum: 0,
                        aStr: 'foo',
                        aBool: false
                    }
                });
                var ref = stubRef();
                var obj = new F(ref);
                ref.flush();
                expect(obj).toEqual(jasmine.objectContaining({
                    aNum: 0,
                    aStr: 'foo',
                    aBool: false
                }));
            })
        });

        describe('$save', function() {

            //not passing in service
            it('should work on a query', function() {
                var ref = stubRef();
                ref.set({
                    foo: 'baz'
                });
                ref.flush();
                var spy = spyOn(ref, 'update');
                var query = ref.limit(3);
                var obj = $firebaseObject(query);
                flushAll(query);
                obj.foo = 'bar';
                obj.$save();
                flushAll(query);
                expect(spy).toHaveBeenCalledWith({
                    foo: 'bar'
                }, jasmine.any(Function));
            });
        });


        describe('$bindTo', function() {

            //not passing in service
            it('should throw error if double bound', function() {
                var $scope = $rootScope.$new();
                var aSpy = jasmine.createSpy('firstBind');
                var bResolve = jasmine.createSpy('secondBindResolve');
                var bReject = jasmine.createSpy('secondBindReject');
                obj.$bindTo($scope, 'a').then(aSpy);
                flushAll();
                expect(aSpy).toHaveBeenCalled();
                obj.$bindTo($scope, 'b').then(bResolve, bReject);
                flushAll();
                expect(bResolve).not.toHaveBeenCalled();
                expect(bReject).toHaveBeenCalled();
            });
				});

        describe('$watch', function() {
            it('should return a deregistration function', function() {
                var spy = jasmine.createSpy('$watch');
                var off = obj.$watch(spy);
                obj.foo = 'watchtest';
                obj.$save();
                flushAll();
                expect(spy).toHaveBeenCalled();
                spy.calls.reset();
                off();
                expect(spy).not.toHaveBeenCalled();
            });

            it('additional calls to the deregistration function should be silently ignored', function() {
                var spy = jasmine.createSpy('$watch');
                var off = obj.$watch(spy);
                off();
                off();
                obj.foo = 'watchtest';
                obj.$save();
                flushAll();
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('$extend', function() {
            it('should preserve child prototype', function() {
                function Extend() {
                    $firebaseObject.apply(this, arguments);
                }
                Extend.prototype.foo = function() {};
                var ref = stubRef();
                $firebaseObject.$extend(Extend);
                var arr = new Extend(ref);
                expect(arr.foo).toBeA('function');
            });

            it('should return child class', function() {
                function A() {}
                var res = $firebaseObject.$extend(A);
                expect(res).toBe(A);
            });

            it('should be instanceof $firebaseObject', function() {
                function A() {}
                $firebaseObject.$extend(A);
                expect(new A(stubRef())).toBeInstanceOf($firebaseObject);
            });

            it('should add on methods passed into function', function() {
                function foo() {
                    return 'foo';
                }
                var F = $firebaseObject.$extend({
                    foo: foo
                });
                var res = F(stubRef());
                expect(res.$$updated).toBeA('function');
                expect(res.foo).toBeA('function');
                expect(res.foo()).toBe('foo');
            });


            it('should work with the new keyword', function() {
                var fn = function() {};
                var Res = $firebaseObject.$extend({
                    foo: fn
                });
                expect(new Res(stubRef()).foo).toBeA('function');
            });

            it('should work without the new keyword', function() {
                var fn = function() {};
                var Res = $firebaseObject.$extend({
                    foo: fn
                });
                expect(Res(stubRef()).foo).toBeA('function');
            });
        });

        describe('$$updated', function() {
            it('should add keys to local data', function() {
                obj.$$updated(fakeSnap({
                    'key1': true,
                    'key2': 5
                }));
                expect(obj.key1).toBe(true);
                expect(obj.key2).toBe(5);
            });

            it('should remove old keys', function() {
                var keys = ['aString', 'aNumber', 'aBoolean', 'anObject'];
                keys.forEach(function(k) {
                    expect(obj).toHaveKey(k);
                });
                obj.$$updated(fakeSnap(null));
                flushAll();
                keys.forEach(function(k) {
                    expect(obj).not.toHaveKey(k);
                });
            });

            it('should assign null to $value', function() {
                obj.$$updated(fakeSnap(null));
                expect(obj.$value).toBe(null);
            });

            it('should assign primitive value to $value', function() {
                obj.$$updated(fakeSnap(false));
                expect(obj.$value).toBe(false);
            });

            it('should remove other keys when setting primitive', function() {
                var keys = Object.keys(obj);
            });

            it('should preserve the id', function() {
                obj.$id = 'change_id_for_test';
                obj.$$updated(fakeSnap(true));
                expect(obj.$id).toBe('change_id_for_test');
            });

            it('should set the priority', function() {
                obj.$priority = false;
                obj.$$updated(fakeSnap(null, true));
                expect(obj.$priority).toBe(true);
            });

            it('should apply $$defaults if they exist', function() {
                var F = $firebaseObject.$extend({
                    $$defaults: {
                        baz: 'baz',
                        aString: 'bravo'
                    }
                });
                var obj = new F(stubRef());
                obj.$$updated(fakeSnap(FIXTURE_DATA));
                expect(obj.aString).toBe(FIXTURE_DATA.aString);
                expect(obj.baz).toBe('baz');
            });
        });

        describe('$$error', function() {
            it('will log an error', function() {
                obj.$$error(new Error());
                expect(log.error).toHaveLength(1);
            });

            it('will call $destroy', function() {
                obj.$destroy = jasmine.createSpy('$destroy');
                var error = new Error();
                obj.$$error(error);
                expect(obj.$destroy).toHaveBeenCalledWith(error);
            });
        });

        function flushAll() {
            Array.prototype.slice.call(arguments, 0).forEach(function(o) {
                angular.isFunction(o.resolve) ? o.resolve() : o.flush();
            });
            try {
                obj.$ref().flush();
            } catch (e) {}
            try {
                $interval.flush(500);
            } catch (e) {}
            try {
                $timeout.flush();
            } catch (e) {}
        }

        var pushCounter = 1;

        function fakeSnap(data, pri) {
            return testutils.refSnap(testutils.ref('data/a'), data, pri);
        }

        function stubRef() {
            return mockObj.stubRef();
        }

        function makeObject(initialData, ref) {
            return mockObj.makeObject(initialData, ref);
        }

        function spyOnWatch($scope) {
            // hack on $scope.$watch to return our spy instead of the usual
            // so that we can determine if it gets called
            var _watch = $scope.$watch;
            spyOn($scope, '$watch').and.callFake(function(varName, callback) {
                // call the real watch method and store the real off method
                var _off = _watch.call($scope, varName, callback);
                // replace it with our 007
                var offSpy = jasmine.createSpy('off method for $watch').and.callFake(function() {
                    // call the real off method
                    _off();
                });
                $scope.$watch.$$$offSpy = offSpy;
                return offSpy;
            });
        }
    });
});
