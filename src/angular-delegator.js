(function() {
  'use strict';

  var module = angular.module('delegator', []);

  module.provider('$delegator', function() {
    var collections = {};

    this.$get = ['$injector', function($injector) {

      var map = function(arr, fn) {
          return arr.map(fn);
        },

        getArgs = function(args) {
          return [].slice.call(args, 1);
        },

        getFunctions = function(selector) {
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

        extend = function(acc, obj) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              acc[key] = obj[key];
            }
          }
          return acc;
        },

        mapSelector = function(selector) {
          var args = getArgs(arguments),
            fns = getFunctions(selector);

          return map(fns, function(fn) {
            return fn.apply(null, args);
          });
        },

        mergeSelector = function() {
          return mapSelector.apply(null, arguments).reduce(extend, {});
        },

        someSelector = function(selector, args, value) {
          return mapSelector.apply(null, [selector].concat(args)).some(function(result) { return result === value; });
        },

        anySelector = function(selector) {
          return someSelector(selector, getArgs(arguments), true);
        },

        allSelector = function(selector) {
          return !someSelector(selector, getArgs(arguments), false);
        },

        noneSelector = function(selector) {
          return !someSelector(selector, getArgs(arguments), true);
        };

      return {
        map: mapSelector,
        merge: mergeSelector,
        any: anySelector,
        all: allSelector,
        none: noneSelector
      };
    }];

    this.set = function(name, services) {
      collections[name] = services;
      return this;
    };
  });
}());
