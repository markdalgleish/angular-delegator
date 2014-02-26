angular.module('delegator')
  .factory('TruthyDelegatorStrategy', function(MapDelegatorStrategy) {
    return function() {
      return MapDelegatorStrategy.apply(null, arguments).filter(function(result) { return result; });
    };
  });
