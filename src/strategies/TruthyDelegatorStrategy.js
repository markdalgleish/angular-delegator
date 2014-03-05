angular.module('delegator')
  .factory('TruthyDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    return function() {
      return MapDelegatorStrategy.apply(null, arguments).filter(function(result) { return result; });
    };
  }]);
