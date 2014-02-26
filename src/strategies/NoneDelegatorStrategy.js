angular.module('delegator')
  .factory('NoneDelegatorStrategy', function(SomeDelegatorStrategyFactory) {
    return SomeDelegatorStrategyFactory(true, true);
  });
