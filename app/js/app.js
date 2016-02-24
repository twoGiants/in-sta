'use strict';

var angular = require('angular');
// TODO
require('angular-route');
// TODO
var tableCtrl = require('./controllers/tablectrl');
// TODO
var navigationCtrl = require('./controllers/navigationctrl');
// TODO
var statisticsTable = require('./directives/statisticstable');
// TODO
var navigationBar = require('./directives/navigationbar');

var dataShareService = require('./services/datashare.service');

require('jquery');
require('./../css/app.css');

var inSta = angular.module('inSta', ['ngRoute']);

// controllers
inSta.controller('tableCtrl', ['$scope', '$filter', '$http', 'dataShareService', 'statTools', tableCtrl]);
inSta.controller('navigationCtrl', ['$scope', '$http' ,'dataShareService', navigationCtrl]);

// directives
inSta.directive('statisticsTable', [statisticsTable]);
inSta.directive('navigationBar', [navigationBar]);

// factories
inSta.factory('dataShareService', ['$rootScope', dataShareService]);


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

// filters
inSta.filter('monthName', [function() {
    return function (monthNumber) {
        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        return monthNames[monthNumber - 1];
    }
}]);

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