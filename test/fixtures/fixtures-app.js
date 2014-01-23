(function() {
  'use strict';

  var app = angular.module('fixturesApp', ['delegator']);

  app.config(function($delegatorProvider) {

    var serviceNamesFor = function(type) {
      return ['Foo','Bar','Baz'].map(function(name) { return type + name; });
    };

    ['Function', 'Object', 'NestedObject', 'MultipleArg', 'Boolean'].forEach(function(type) {
      $delegatorProvider.set(type + 'Services', serviceNamesFor(type));
    });

    $delegatorProvider.set('EchoServices', [
      'EchoA',
      'EchoB',
      'EchoC',
      'EchoD',
      'EchoE'
    ]);

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

    app.factory('MultipleArg' + serviceName, function() {
      return function(arg1, arg2, arg3){
        var obj = {};
        obj[serviceName.toLowerCase()] = [arg1, arg2, arg3];
        return obj;
      };
    });

    app.factory('Boolean' + serviceName, function() {
      return function(values){
        return values[i];
      };
    });

  });

  ['A', 'B', 'C', 'D', 'E'].forEach(function(serviceName, i) {
    app.factory('Echo' + serviceName, function() {
      return function(values){
        return values[i];
      };
    });
  });

}());
