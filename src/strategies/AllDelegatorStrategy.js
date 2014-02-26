angular.module('delegator')
  .factory('AllDelegatorStrategy', function(SomeDelegatorStrategyFactory) {
    return SomeDelegatorStrategyFactory(false, true);
  });
