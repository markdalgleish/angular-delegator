'use strict';

describe('Module: Delegator', function () {

  var app, results, Delegator;

  describe('Delegator', function() {

    beforeEach(module('fixturesApp'));

    beforeEach(inject(function(_Delegator_) {
      Delegator = _Delegator_;
    }));

    describe('selectors', function() {

      it('should support services that return only functions', function() {
        expect(Delegator.run('FunctionServices', 'map', 123)).toEqual([{ foo: 123 }, { bar: 123 }, { baz: 123 }]);
      });

      it('should support services that return objects', function() {
        expect(Delegator.run('ObjectServices.echo', 'map', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

      it('should support services that return nested objects', function() {
        expect(Delegator.run('NestedObjectServices.foo.bar.baz.echo', 'map', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

    });

  });

  describe('service', function() {

    var TestDelegator, returnValue, strategySpy, Foo, Bar, Baz;

    beforeEach(function() {
      returnValue = { foo: 'bar' };
      strategySpy = jasmine.createSpy('strategySpy').andReturn(returnValue);
      Foo = { qux: jasmine.createSpy('FooQux') };
      Bar = { qux: jasmine.createSpy('BarQux') };
      Baz = { qux: jasmine.createSpy('BazQux') };
    });

    describe('custom function strategies', function() {

      beforeEach(function() {
        app = angular.module('serviceTestApp', ['delegator'])
          .factory('Foo', function() {
            return Foo;
          })
          .factory('Bar', function() {
            return Bar;
          })
          .factory('Baz', function() {
            return Baz;
          })
          .factory('FooBarDelegatorStrategy', function() {
            return strategySpy;
          })
          .config(function(DelegatorProvider) {
            DelegatorProvider.service('TestDelegator', {
              interface: 'fooBar',
              delegates: [
                'Foo',
                'Bar',
                'Baz'
              ]
            });
          });

        module('serviceTestApp');

        inject(function(_Delegator_, _TestDelegator_) {
          Delegator = _Delegator_;
          TestDelegator = _TestDelegator_;
        });
      });

      it('should allow the use of custom strategies', function() {
        var expected = returnValue,
          result = TestDelegator(1,2,3,4);

        expect(result).toBe(expected);
        expect(strategySpy).toHaveBeenCalledWith([Foo, Bar, Baz], [1, 2, 3, 4]);
      });

    });

    describe('custom object strategies', function() {

      beforeEach(function() {
        app = angular.module('serviceTestApp', ['delegator'])
          .factory('Foo', function() {
            return Foo;
          })
          .factory('Bar', function() {
            return Bar;
          })
          .factory('Baz', function() {
            return Baz;
          })
          .factory('FooBarDelegatorStrategy', function() {
            return strategySpy;
          })
          .config(function(DelegatorProvider) {
            DelegatorProvider.service('TestDelegator', {
              interface: {
                'qux': 'fooBar'
              },
              delegates: [
                'Foo',
                'Bar',
                'Baz'
              ]
            });
          });

        module('serviceTestApp');

        inject(function(_Delegator_, _TestDelegator_) {
          Delegator = _Delegator_;
          TestDelegator = _TestDelegator_;
        });
      });

      it('should allow the use of custom strategies', function() {
        var expected = returnValue,
          result = TestDelegator.qux(1,2,3,4);

        expect(result).toBe(expected);
        expect(strategySpy).toHaveBeenCalledWith([Foo.qux, Bar.qux, Baz.qux], [1, 2, 3, 4]);
      });

    });

  });

});
