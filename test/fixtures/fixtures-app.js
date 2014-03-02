(function() {
  'use strict';

  var app = angular.module('fixturesApp', ['delegator']);

  app.config(function(DelegatorProvider) {

    var serviceNamesFor = function(type) {
      return ['Foo','Bar','Baz'].map(function(name) { return type + name; });
    };

    ['Function', 'Object', 'NestedObject'].forEach(function(type) {
      DelegatorProvider.set(type + 'Services', serviceNamesFor(type));
    });

  });

  ['Foo', 'Bar', 'Baz'].forEach(function(serviceName, i) {

    app.factory('Function' + serviceName, function() {
      return function(arg){
        var obj = {};
        obj[serviceName.toLowerCase()] = arg;
        return obj;
      };
    });

    app.factory('Object' + serviceName, function() {
      return {
        echo: function(arg){
          var obj = {};
          obj[serviceName.toLowerCase()] = arg;
          return obj;
        }
      };
    });

    app.factory('NestedObject' + serviceName, function() {
      return {
        foo: {
          bar: {
            baz: {
              echo: function(arg){
                var obj = {};
                obj[serviceName.toLowerCase()] = arg;
                return obj;
              }
            }
          }
        }
      };
    });

  });

}());
