angular.module('delegator')
  .factory('AnyDelegatorStrategy', function(SomeDelegatorStrategyFactory) {
    return SomeDelegatorStrategyFactory(true, false);
  });
