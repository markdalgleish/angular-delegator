'use strict';

describe('MergeDelegatorStrategy', function() {

  var MergeDelegatorStrategy;

  beforeEach(module('delegator'));

  beforeEach(inject(function(_MergeDelegatorStrategy_) {
    MergeDelegatorStrategy = _MergeDelegatorStrategy_;
  }));

  it('should call all functions with supplied arguments', function() {
    var fns = [
        jasmine.createSpy('fn1'),
        jasmine.createSpy('fn2'),
        jasmine.createSpy('fn3')
      ],
      args = ['arg1','arg2'];
    MergeDelegatorStrategy(fns, args);

    fns.forEach(function(fn) {
      expect(fn).toHaveBeenCalledWith(args[0], args[1]);
    });
  });

  it('should return an object of merged results', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn({ foo: true }),
        jasmine.createSpy('fn2').andReturn({ bar: true }),
        jasmine.createSpy('fn3').andReturn({ baz: true })
      ],
      result = MergeDelegatorStrategy(fns, []);

    expect(result).toEqual({ foo: true, bar: true, baz: true });
  });

  it('should ignore properties from prototype objects', function() {
    var setProto = function(obj) {
        obj.__proto__ = { ignore: 'me' };
        return obj;
      };

    var fns = [
        jasmine.createSpy('fn1').andReturn(setProto({ foo: true })),
        jasmine.createSpy('fn2').andReturn(setProto({ bar: true })),
        jasmine.createSpy('fn3').andReturn(setProto({ baz: true }))
      ],
      result = MergeDelegatorStrategy(fns, []);

    expect(result).toEqual({ foo: true, bar: true, baz: true });
  });

});
