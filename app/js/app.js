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
inSta.controller('tableCtrl', ['$scope', '$filter', '$http', 'dataShare', 'statTools', tableCtrl]);
inSta.controller('navigationCtrl', ['$scope', '$http' ,'dataShare', navigationCtrl]);

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
    service.TESTsendData = function (TESTdata) {
        this.data = TESTdata;
        $rootScope.$broadcast('TESTdata_shared');
    };
    service.getData = function () {
        return this.data;
    };
    service.sendDataFromTableCtrl = function (data) {
        this.data = data;
        $rootScope.$broadcast('data_shared_tableCtrl');
    };
    service.sendDataFromNavigationCtrl = function (data) {
        this.data = data;
        $rootScope.$broadcast('data_shared_navigationCtrl');
    };
    return service;
});

inSta.factory('statTools', function() {
    var service = {};
    service.growth = false;
    
    //calc and set growth
    service.calcGrowth = function (data) {
        for (var i in data) {
            if (i < 1) {
                data[i].growth = '---';
            } else {
                data[i].growth = data[i].followers - data[i - 1].followers;
            }
        }
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