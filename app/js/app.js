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
var statToolsService = require('./services/stattools.service');

require('jquery');
require('./../css/app.css');

angular
    .module('inSta', [
        'ngRoute'
    ]);

angular
    .module('inSta')
    .controller('tableCtrl', tableCtrl)
    .controller('navigationCtrl', navigationCtrl)
    .directive('statisticsTable', statisticsTable)
    .directive('navigationBar', navigationBar)
    .factory('dataShareService', dataShareService)
    .factory('statToolsService', statToolsService)
    .filter('monthName', monthName);

tableCtrl.$inject = ['$scope', '$filter', '$http', 'dataShareService', 'statToolsService'];
navigationCtrl.$inject = ['$scope', '$http' ,'dataShareService'];
dataShareService.$inject = ['$rootScope'];

/*var inSta = angular.module('inSta', ['ngRoute']);

// controllers
inSta.controller('tableCtrl', ['$scope', '$filter', '$http', 'dataShareService', 'statToolsService', tableCtrl]);
inSta.controller('navigationCtrl', ['$scope', '$http' ,'dataShareService', navigationCtrl]);

// directives
inSta.directive('statisticsTable', [statisticsTable]);
inSta.directive('navigationBar', [navigationBar]);

// factories
inSta.factory('dataShareService', ['$rootScope', dataShareService]);
inSta.factory('statToolsService', [statToolsService]);

// filters
inSta.filter('monthName', monthName);*/

function monthName() {
    return function (monthNumber) {
        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        return monthNames[monthNumber - 1];
    }
}

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