'use strict';
var angular = require('angular');
//var ngResource = require('angular-resource');
require('angular-route');
var tableCtrl = require('./controllers/tablectrl');
var inStaDirectives = require('./directives');
require('jquery');
require('./../css/app.css');

var inSta = angular.module('inSta', [
    'ngRoute',
    'inStaDirectives'
]);

inSta.controller('tableCtrl', ['$scope', '$filter', '$http', tableCtrl]);









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