angular.module('delegator')
  .factory('SomeDelegatorStrategyFactory', function(MapDelegatorStrategy) {
    var invert = function(fn) {
      return function() {
        return !fn.apply(this, arguments);
      };
    };

    return function(value, isInverted) {
      var strategy = function(fns, args) {
        return MapDelegatorStrategy(fns, args).some(function(result) { return result === value; });
      };
      return isInverted ? invert(strategy) : strategy;
    };
  });
