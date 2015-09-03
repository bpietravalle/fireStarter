(function() {
    "use strict";
    describe("getObj", function() {
        var getObj, mockObj, obj, ref, $interval, $timeout;
        var FIXTURE_DATA = {
            aString: 'alpha',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'bravo'
            }
        };


        beforeEach(function() {
            module('srvc.query');
            module("fbMocks");
            inject(function(_mockObj_, _getObj_, _$timeout_, _$interval_) {
                getObj = _getObj_;
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
        describe('id', function() {
            it('should be equal to $ref().key()', function() {
                expect(getObj.id(obj)).toEqual(obj.$ref().key());
            });
        });
        describe('ref', function() {
            it('should return the Firebase instance that created it', function() {
                expect(getObj.ref(obj)).toBe(ref);
            });
        });
        describe('load', function() {
            beforeEach(function() {
                this.good = jasmine.createSpy('resolve');
                this.bad = jasmine.createSpy('reject');
            });
            it('should return a resolved promise', function() {
                var test = getObj.load(obj);
                expect(test).toBeAPromise();
                expect(test.$$state.status).toEqual(1);
            });
            it('should resolve when all data is received', function() {
                var test = getObj.load(obj);
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
                var test = getObj.load(obj);
                test.then(this.good, this.bad);
								flushAll();
								expect(this.good).not.toHaveBeenCalled();
								expect(this.bad).toHaveBeenCalledWith(err);
            });
						it("resolves to the firebaseObject instance", function(){
							var spy = jasmine.createSpy('loaded');
							getObj.load(obj).then(spy);
							flushAll();
							expect(spy).toHaveBeenCalledWith(obj);
						});
            it('should contain all data at the time $loaded is called', function() {
                var obj = mockObj.makeObject();
                var spy = jasmine.createSpy('loaded').and.callFake(function(data) {
                    expect(data).toEqual(jasmine.objectContaining(FIXTURE_DATA));
                });
                getObj.load(obj, spy);
                obj.$ref().set(FIXTURE_DATA);
                flushAll(obj.$ref());
                expect(spy).toHaveBeenCalled();
            });
            it('should trigger if attached after load completes', function() {
                var obj = mockObj.makeObject();
                var spy = jasmine.createSpy('$loaded');
                obj.$ref().flush();
                getObj.load(obj, spy);
                flushAll();
                expect(spy).toHaveBeenCalled();
            });
            it('should trigger if attached before load completes', function() {
                var obj = mockObj.makeObject();
                var spy = jasmine.createSpy('$loaded');
								getObj.load(obj, spy);
                expect(spy).not.toHaveBeenCalled();
                flushAll(obj.$ref());
                expect(spy).toHaveBeenCalled();
            });

            it('should resolve properly if function passed directly into $loaded', function() {
                var spy = jasmine.createSpy('loaded');
                getObj.load(obj, spy);
                flushAll();
                expect(spy).toHaveBeenCalledWith(obj);
            });
            it('should reject properly if function passed directly into $loaded', function() {
                var err = new Error('test_fail');
                ref.failNext('once', err);
                var obj = mockObj.makeObject(undefined, ref);
                getObj.load(obj, this.good,this.bad );
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
								getObj.save(obj, null);
                // obj.$save();
                expect(obj.$ref().set).toHaveBeenCalled();
            });

            it('should return a promise', function() {
                expect(obj.$save()).toBeAPromise();
            });

            // it('should resolve promise to the ref for this object', function() {
            //     var whiteSpy = jasmine.createSpy('resolve');
            //     var blackSpy = jasmine.createSpy('reject');
            //     obj.$save().then(whiteSpy, blackSpy);
            //     expect(whiteSpy).not.toHaveBeenCalled();
            //     flushAll();
            //     expect(whiteSpy).toHaveBeenCalled();
            //     expect(blackSpy).not.toHaveBeenCalled();
            // });

            // it('should reject promise on failure', function() {
            //     var whiteSpy = jasmine.createSpy('resolve');
            //     var blackSpy = jasmine.createSpy('reject');
            //     var err = new Error('test_fail');
            //     obj.$ref().failNext('set', err);
            //     obj.$save().then(whiteSpy, blackSpy);
            //     expect(blackSpy).not.toHaveBeenCalled();
            //     flushAll();
            //     expect(whiteSpy).not.toHaveBeenCalled();
            //     expect(blackSpy).toHaveBeenCalledWith(err);
            // });

            // it('should trigger watch event', function() {
            //     var spy = jasmine.createSpy('$watch');
            //     obj.$watch(spy);
            //     obj.foo = 'watchtest';
            //     obj.$save();
            //     flushAll();
            //     expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
            //         event: 'value',
            //         key: obj.$id
            //     }));
            // });

            // it('should work on a query', function() {
            //     var ref = stubRef();
            //     ref.set({
            //         foo: 'baz'
            //     });
            //     ref.flush();
            //     var spy = spyOn(ref, 'update');
            //     var query = ref.limit(3);
            //     var obj = $firebaseObject(query);
            //     flushAll(query);
            //     obj.foo = 'bar';
            //     obj.$save();
            //     flushAll(query);
            //     expect(spy).toHaveBeenCalledWith({
            //         foo: 'bar'
            //     }, jasmine.any(Function));
            // });
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

    });
})();
