'use strict';

var angular = require('angular');
require('angular-route');
var tableCtrl = require('./controllers/tablectrl');
var navigationCtrl = require('./controllers/navigationctrl');
var statisticsTable = require('./directives/statisticstable');
var navigationBar = require('./directives/navigationbar');
require('jquery');
require('./../css/app.css');

var inSta = angular.module('inSta', ['ngRoute']);

// controllers
inSta.controller('tableCtrl', ['$scope', '$filter', '$http', 'dataShare', tableCtrl]);
inSta.controller('navigationCtrl', ['$scope', 'dataShare', navigationCtrl]);

// directives
inSta.directive('statisticsTable', [statisticsTable]);
inSta.directive('navigationBar', [navigationBar]);

// factory
inSta.factory('dataShare', function ($rootScope) {
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
});

// Example code ---------------------------------------------------
/*inSta.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/view1', {
        templateUrl: 'partials/view1.html',
        controller: 'view1Ctrl'
    }).
    when('/view2', {
        templateUrl: 'partials/view2.html',
        controller: 'view2Ctrl'
    }).
    otherwise({
        redirectTo: '/view1'
    });
}]);*/