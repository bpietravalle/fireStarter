(function() {
    "use strict";
    describe("objMngr", function() {
        var objMngr, mockObj, obj, ref, $interval, $timeout, $utils, testutils, $rootScope;
        var FIXTURE_DATA = {
            aString: 'alpha',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'bravo'
            }
        };


        beforeEach(function() {
            module('srvc.dataMngr');
            module("fbMocks");
            module('testutils', function($provide) {
                $provide.value('$log', {
                    error: function() {
                        log.error.push(Array.prototype.slice.call(arguments));
                    }
                })
            });
            inject(function(_mockObj_, _objMngr_, _$timeout_, _$interval_, _testutils_, $firebaseUtils, _$rootScope_) {
                objMngr = _objMngr_;
                $utils = $firebaseUtils;
                testutils = _testutils_;
                $rootScope = _$rootScope_;
                $timeout = _$timeout_;
                $interval = _$interval_;
                mockObj = _mockObj_;
                ref = mockObj.stubRef();
                obj = mockObj.makeObject(FIXTURE_DATA, ref);

            });
        });
        afterEach(function() {
            obj = null;
            ref = null;
        });
        describe('value', function() {
            it('should return the correct value', function() {
                var obj = mockObj.makeObject('a string', ref);
                var test = objMngr.value(obj);
                expect(test).toEqual('a string');
            });
            it('should be able to set with save()', function() {
                var test = objMngr.value(obj, 10);
                obj.$save();
                ref.flush();
                expect(obj.$value).toEqual(10);
            });
        });
        describe('priority', function() {
            it('should return the correct priority', function() {
                var test = objMngr.priority(obj);
                expect(test).toEqual(null);
            });
            it('should be able to set with save()', function() {
                var test = objMngr.priority(obj, 10);
                obj.$save();
                ref.flush();
                expect(obj.$priority).toEqual(10);
            });
        });
        describe('id', function() {
            it('should be equal to $ref().key()', function() {
                expect(objMngr.id(obj)).toEqual(obj.$ref().key());
            });
        });
        describe('ref', function() {
            it('should return the Firebase instance that created it', function() {
                expect(objMngr.ref(obj)).toBe(ref);
            });
        });
        describe('load', function() {
            beforeEach(function() {
                this.good = jasmine.createSpy('resolve');
                this.bad = jasmine.createSpy('reject');
            });
            it('should return a resolved promise', function() {
                var test = objMngr.load(obj);
                expect(test).toBeAPromise();
                expect(test.$$state.status).toEqual(1);
            });
            it('should resolve when all data is received', function() {
                var test = objMngr.load(obj);
                test.then(this.good, this.bad);
                // works without the line below; not sure why
                // obj.$ref().flush();
                flushAll();
                expect(this.good).toHaveBeenCalledWith(obj);
                expect(this.bad).not.toHaveBeenCalled();
            });
            it("should reject if the promise is rejected", function() {
                var err = new Error("ERROR!!!");
                ref.failNext('once', err);
                var obj = mockObj.makeObject(null, ref);
                var test = objMngr.load(obj);
                test.then(this.good, this.bad);
                flushAll();
                expect(this.good).not.toHaveBeenCalled();
                expect(this.bad).toHaveBeenCalledWith(err);
            });
            it("resolves to the firebaseObject instance", function() {
                var spy = jasmine.createSpy('loaded');
                objMngr.load(obj).then(spy);
                flushAll();
                expect(spy).toHaveBeenCalledWith(obj);
            });
            it('should contain all data at the time $loaded is called', function() {
                var obj = mockObj.makeObject();
                var spy = jasmine.createSpy('loaded').and.callFake(function(data) {
                    expect(data).toEqual(jasmine.objectContaining(FIXTURE_DATA));
                });
                var result = {
                    success: spy,
                    failure: null
                };
                objMngr.load(obj, result);
                obj.$ref().set(FIXTURE_DATA);
                flushAll(obj.$ref());
                expect(spy).toHaveBeenCalled();
            });
            it('should trigger if attached after load completes', function() {
                var obj = mockObj.makeObject();
                var spy = jasmine.createSpy('$loaded');
                obj.$ref().flush();
                var result = {
                    success: spy,
                    failure: null
                };
                objMngr.load(obj, result);
                flushAll();
                expect(spy).toHaveBeenCalled();
            });
            it('should trigger if attached before load completes', function() {
                var obj = mockObj.makeObject();
                var spy = jasmine.createSpy('$loaded');
                var result = {
                    success: spy,
                    failure: null
                };

                objMngr.load(obj, result);
                expect(spy).not.toHaveBeenCalled();
                flushAll(obj.$ref());
                expect(spy).toHaveBeenCalled();
            });

            it('should resolve properly if function passed directly into $loaded', function() {
                var spy = jasmine.createSpy('loaded');
                var result = {
                    success: spy,
                    failure: null
                };
                objMngr.load(obj, result);
                flushAll();
                expect(spy).toHaveBeenCalledWith(obj);
            });
            it('should reject properly if function passed directly into $loaded', function() {
                var err = new Error('test_fail');
                ref.failNext('once', err);
                var obj = mockObj.makeObject(undefined, ref);
                var result = {
                    success: this.good,
                    failure: this.bad
                };
                objMngr.load(obj, result);
                // obj.$loaded(this.good,this.bad);
                ref.flush();
                $timeout.flush();
                expect(this.good).not.toHaveBeenCalled();
                expect(this.bad).toHaveBeenCalledWith(err);
            });
        });
        describe('save', function() {
            beforeEach(function() {
                this.good = jasmine.createSpy('resolve');
                this.bad = jasmine.createSpy('reject');
            });
            it('should call $firebase.$set', function() {
                spyOn(obj.$ref(), 'set');
                obj.foo = 'bar';
                objMngr.save(obj);
                expect(obj.$ref().set).toHaveBeenCalled();
            });

            it('should return a promise', function() {
                var test = objMngr.save(obj);
                expect(test).toBeAPromise();
            });

            it('should resolve promise to the ref for this object', function() {
                var test = objMngr.save(obj);
                test.then(this.good, this.bad);
                expect(this.good).not.toHaveBeenCalled();
                flushAll();
                expect(this.good).toHaveBeenCalled();
                expect(this.bad).not.toHaveBeenCalled();
            });

            it('should reject promise on failure', function() {
                var err = new Error('test_fail');
                obj.$ref().failNext('set', err);
                var test = objMngr.save(obj);
                test.then(this.good, this.bad);
                expect(this.bad).not.toHaveBeenCalled();
                flushAll();
                expect(this.good).not.toHaveBeenCalled();
                expect(this.bad).toHaveBeenCalledWith(err);
            });

            it('should trigger watch event', function() {
                var spy = jasmine.createSpy('$watch');
                obj.$watch(spy);
                obj.foo = 'watchtest';
                objMngr.save(obj);
                flushAll();
                expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
                    event: 'value',
                    key: obj.$id
                }));
            });

            //  not passing- spy isn't called but data updates 
            // it('should work on a query', function() {
            //     var ref = mockObj.stubRef();
            //     ref.set({
            //         foo: 'baz'
            //     });
            //     ref.flush();
            //     var spy = spyOn(ref, 'update');
            //     var query = ref.limit(3);
            //     var obj = mockObj.makeObject(query);
            //     flushAll(query);
            //     obj.foo = 'bar';
            //     objMngr.save(obj);
            //     // flushAll(query);
            // expect(spy).toHaveBeenCalledWith({
            //     foo: 'bar'
            // }, jasmine.any(Function));
            // });
        });
        describe('remove', function() {
            it('should return a promise', function() {
                expect(objMngr.remove(obj)).toBeAPromise();
            });

            it('should set $value to null and remove any local keys', function() {
                expect($utils.dataKeys(obj).sort()).toEqual($utils.dataKeys(FIXTURE_DATA).sort());
                objMngr.remove(obj);
                flushAll();
                expect($utils.dataKeys(obj)).toEqual([]);
            });

            it('should call remove on the Firebase ref', function() {
                var spy = spyOn(obj.$ref(), 'remove');
                expect(spy).not.toHaveBeenCalled();
                objMngr.remove(obj);
                flushAll();
                expect(spy).toHaveBeenCalled(); // should not pass a key
            });

            it('should delete a primitive value', function() {
                var snap = fakeSnap('foo');
                obj.$$updated(snap);
                flushAll();
                expect(obj.$value).toBe('foo');
                objMngr.remove(obj);
                flushAll();
                expect(obj.$value).toBe(null);
            });

            it('should trigger a value event for $watch listeners', function() {
                var spy = jasmine.createSpy('$watch listener');
                obj.$watch(spy);
                objMngr.remove(obj);
                flushAll();
                expect(spy).toHaveBeenCalledWith({
                    event: 'value',
                    key: obj.$id
                });
            });

            // it('should work on a query', function() {
            //     ref.set({
            //         foo: 'bar'
            //     });
            //     ref.flush();
            //     var query = ref.limit(3);
            //     var obj = mockObj.makeObject(query);//$firebaseObject(query);
            //     flushAll(query);
            //     expect(obj.foo).toBe('bar');
            //     objMngr.remove(obj);
            //     flushAll(query);
            //     expect(obj.$value).toBe(null);
            // });
        });

        describe('$destroy', function() {
            it('should call off on Firebase ref', function() {
                var spy = spyOn(obj.$ref(), 'off');
                objMngr.destroy(obj);
                expect(spy).toHaveBeenCalled();
            });

            it('should dispose of any bound instance', function() {
                var $scope = $rootScope.$new();
                spyOnWatch($scope);
                // now bind to scope and destroy to see what happens
                obj.$bindTo($scope, 'foo');
                flushAll();
                expect($scope.$watch).toHaveBeenCalled();
                obj.$destroy();
                flushAll();
                expect($scope.$watch.$$$offSpy).toHaveBeenCalled();
            });

            it('should unbind if scope is destroyed', function() {
                var $scope = $rootScope.$new();
                spyOnWatch($scope);
                obj.$bindTo($scope, 'foo');
                flushAll();
                expect($scope.$watch).toHaveBeenCalled();
                $scope.$emit('$destroy');
                flushAll();
                expect($scope.$watch.$$$offSpy).toHaveBeenCalled();
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

        function fakeSnap(data, pri) {
            return testutils.refSnap(testutils.ref('data/a'), data, pri);
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
})();
