'use strict';

describe('Module: Delegator', function () {

  var app;

  describe('DelegatorProvider', function() {

    describe('service', function() {

      var TestDelegator, returnValue, strategySpy, Foo, Bar, Baz;

      beforeEach(function() {
        returnValue = { foo: 'bar' };
        strategySpy = jasmine.createSpy('strategySpy').andReturn(returnValue);
        Foo = { qux: jasmine.createSpy('FooQux') };
        Bar = { qux: jasmine.createSpy('BarQux') };
        Baz = { qux: jasmine.createSpy('BazQux') };

        app = angular.module('serviceTestApp', ['delegator'])
          .factory('Foo', function() { return Foo; })
          .factory('Bar', function() { return Bar; })
          .factory('Baz', function() { return Baz; })
          .factory('FooBarDelegatorStrategy', function() { return strategySpy; })
          .factory('TestDelegator', function(Delegator) {
            return Delegator.create({
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

        inject(function(_TestDelegator_) {
          TestDelegator = _TestDelegator_;
        });
      });

      it('should pass the functions and arguments to the delegator strategy', function() {
        var expected = returnValue,
          result = TestDelegator.qux(1,2,3,4);

        expect(result).toBe(expected);
        expect(strategySpy).toHaveBeenCalledWith([Foo.qux, Bar.qux, Baz.qux], [1, 2, 3, 4]);
      });

    });

  });

});
