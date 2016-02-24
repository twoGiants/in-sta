'use strict';

module.exports = function ($rootScope) {
    var service = {};
    service.data = false;
    
    service.sendData = function (data) {
        this.data = data;
        $rootScope.$broadcast('data_shared');
    };
    
    service.getData = function () {
        return this.data;
    };
    
    return service;
}

// Example code ---------------------------------------------------
/*var inStaServices = angular.module('inStaServices', ['ngResource']);

inStaServices.factory('Statistics', ['$resource', function ($resource) {
    console.log('Hello');
    return $resource('statistics/statistics.json', {}, {
        get: {
            method: 'GET'
        }
    });
}]);

inStaServices.service('mathService', function () {
    this.add = function (a, b) {
        return a + b;
    };

    this.subtract = function (a, b) {
        return a - b;
    };

    this.multiply = function (a, b) {
        return a * b;
    };

    this.divide = function (a, b) {
        return a / b;
    };

});

inStaServices.service('calcService', function (mathService) {
    this.square = function (a) {
        return mathService.multiply(a, a);
    };
    this.cube = function (a) {
        return mathService.multiply(a, mathService.multiply(a, a));
    };
});*/