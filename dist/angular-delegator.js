/*!
 * angular-delegator v0.0.6
 * https://github.com/markdalgleish/angular-delegator
 *
 * Copyright 2014, Mark Dalgleish
 * This content is released under the MIT license
 */

(function() {
  'use strict';

  angular.module('delegator', [])

    .provider('Delegator', ['$provide', function($provide) {
      var collections = {};

      this.$get = ['$injector', function($injector) {

        var getFunctions = function(selector) {
            var parts = selector.split('.'),
              name = parts[0],
              serviceInstances = collections[name].map($injector.get),
              propertyNames = parts.slice(1),
              fns = serviceInstances;

            propertyNames.forEach(function(propertyName) {
              fns = fns.map(function(fn) {
                return fn[propertyName];
              });
            });

            return fns;
          },

          strategyServiceNameFrom = function(strategyShortName) {
            return strategyShortName[0].toUpperCase() +
              strategyShortName.slice(1) +
              'DelegatorStrategy';
          };

        var strategies = {};

        return {
          run: function(selector, strategyShortName) {
            var args = [].slice.call(arguments, 2);
            return $injector.get(strategyServiceNameFrom(strategyShortName)).call(null, getFunctions(selector), args);
          }
        };
      }];

      this.set = function(name, services) {
        collections[name] = services;
        return this;
      };

      this.service = function(name, options) {
        this.set(name, options.delegates);

        $provide.service(name, ['Delegator', function(Delegator) {
          var makeDelegatorFunction = function(method, strategy) {
            var selector = name + (method ? '.' + method : '');
            return function() {
              return Delegator.run.apply(null, [selector, strategy || options.interface].concat([].slice.call(arguments)));
            };
          };

          return typeof options.interface === 'object' ?
            Object.keys(options.interface).reduce(function(delegator, method) {
              delegator[method] = makeDelegatorFunction(method, options.interface[method]);
              return delegator;
            }, {}) :
            makeDelegatorFunction();
        }]);

        return this;
      };
    }])

    .factory('MapDelegatorStrategy', function() {
      var map = function(arr, fn) {
        return arr.map(fn);
      };

      return function(fns, args) {
        return map(fns, function(fn) {
          return fn.apply(null, args);
        });
      };
    })

    .factory('MergeDelegatorStrategy', function(MapDelegatorStrategy) {
      var extend = function(acc, obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            acc[key] = obj[key];
          }
        }
        return acc;
      };

      return function() {
        return MapDelegatorStrategy.apply(null, arguments).reduce(extend, {});
      };
    })

    .factory('TruthyDelegatorStrategy', function(MapDelegatorStrategy) {
      return function() {
        return MapDelegatorStrategy.apply(null, arguments).filter(function(result) { return result; });
      };
    })

    .factory('SomeDelegatorStrategy', function(MapDelegatorStrategy) {
      return function(fns, args, value) {
        return MapDelegatorStrategy(fns, args).some(function(result) { return result === value; });
      };
    })

    .factory('AnyDelegatorStrategy', function(SomeDelegatorStrategy) {
      return function(fns, args) {
        return SomeDelegatorStrategy(fns, args, true);
      };
    })

    .factory('AllDelegatorStrategy', function(SomeDelegatorStrategy) {
      return function(fns, args) {
        return !SomeDelegatorStrategy(fns, args, false);
      };
    })

    .factory('NoneDelegatorStrategy', function(SomeDelegatorStrategy) {
      return function(fns, args) {
        return !SomeDelegatorStrategy(fns, args, true);
      };
    });

}());
