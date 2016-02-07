'use strict';
var angular = require('angular');
var ngResource = require('angular-resource');
var ngRoute = require('angular-route');
var inStaControllers = require('./controllers');
var inStaDirectives = require('./directives');
var $ = require('jquery');
var css = require('./../css/app.css');

var inSta = angular.module('inSta', [
    'ngRoute',
    'inStaControllers',
    'inStaDirectives'
]);









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