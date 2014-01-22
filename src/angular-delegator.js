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

        getMethods = function(selector) {
          var parts = selector.split('.'),
            name = parts[0],
            serviceInstances = collections[name].map($injector.get),
            propertyNames = parts.slice(1),
            methods = serviceInstances;

          propertyNames.forEach(function(propertyName) {
            methods = methods.map(function(fn) {
              return fn[propertyName];
            });
          });

          return methods;
        },

        extend = function(acc, obj) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              acc[key] = obj[key];
            }
          }
          return acc;
        };

      return {
        map: function(selector) {
          var args = getArgs(arguments),
            methods = getMethods(selector);

          return map(methods, function(method) {
            return method.apply(null, args);
          });
        },
        merge: function(selector) {
          var args = getArgs(arguments),
            results = this.map.apply(this, [selector].concat(args));

          return results.reduce(extend, {});
        },
        any: function(selector) {
          var args = getArgs(arguments),
            results = this.map.apply(this, [selector].concat(args));

          return results.some(function(result) { return result === true; });
        },
        all: function(selector) {
          var args = getArgs(arguments),
            results = this.map.apply(this, [selector].concat(args));

          return !results.some(function(result) { return result === false; });
        },
        none: function(selector) {
          var args = getArgs(arguments),
            results = this.map.apply(this, [selector].concat(args));

          return !results.some(function(result) { return result === true; });
        }
      };
    }];

    this.set = function(name, services) {
      collections[name] = services;
      return this;
    };
  });
}());
