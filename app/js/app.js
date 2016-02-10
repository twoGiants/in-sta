'use strict';
var angular = require('angular');
//var ngResource = require('angular-resource');
require('angular-route');
var tableCtrl = require('./controllers/tablectrl');
var statisticsTable = require('./directives/statisticstable');
require('jquery');
require('./../css/app.css');

var inSta = angular.module('inSta', [
    'ngRoute'
]);

// controllers
inSta.controller('tableCtrl', ['$scope', '$filter', '$http', tableCtrl]);

// directives
inSta.directive('statisticsTable', [statisticsTable]);







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