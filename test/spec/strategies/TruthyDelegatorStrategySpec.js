'use strict';

describe('TruthyDelegatorStrategy', function() {

  var TruthyDelegatorStrategy;

  beforeEach(module('delegator'));

  beforeEach(inject(function(_TruthyDelegatorStrategy_) {
    TruthyDelegatorStrategy = _TruthyDelegatorStrategy_;
  }));

  it('should call all functions with supplied arguments', function() {
    var fns = [
        jasmine.createSpy('fn1'),
        jasmine.createSpy('fn2'),
        jasmine.createSpy('fn3')
      ],
      args = ['arg1','arg2'];
    TruthyDelegatorStrategy(fns, args);

    fns.forEach(function(fn) {
      expect(fn).toHaveBeenCalledWith(args[0], args[1]);
    });
  });

  it('should return an array of truthy results', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn(1),
        jasmine.createSpy('fn2').andReturn(false),
        jasmine.createSpy('fn3').andReturn(2),
        jasmine.createSpy('fn4').andReturn(undefined),
        jasmine.createSpy('fn5').andReturn(3)
      ],
      result = TruthyDelegatorStrategy(fns, []);

    expect(result).toEqual([1,2,3]);
  });

});
