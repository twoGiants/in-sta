'use strict';

var angular = require('angular');
// TODO
require('angular-route');

// TODO
var TableController = require('./controllers/table.controller');
// TODO
var statisticsTable = require('./directives/statisticstable');
// TODO
var navigationBar = require('./directives/navigationbar');

require('angular-resource');

var NavigationController = require('./controllers/navigation.controller');

var dataShareService = require('./services/datashare.service');
var statToolsService = require('./services/stattools.service');
var userDataService = require('./services/userdata.service');

var monthName = require('./filters/monthName');

require('jquery');
require('./../css/app.css');

angular
    .module('inSta', [ 
        'ngRoute', 
        'ngResource' 
    ]);

angular
    .module('inSta')
    .controller('TableController', TableController)
    .controller('NavigationController', NavigationController)
    .directive('statisticsTable', statisticsTable)
    .directive('navigationBar', navigationBar)
    .factory('dataShareService', dataShareService)
    .factory('statToolsService', statToolsService)
    .factory('userDataService', userDataService)
    .filter('monthName', monthName);

TableController.$inject = ['$scope', '$filter', '$http', 'dataShareService', 'statToolsService'];
NavigationController.$inject = ['$http' ,'dataShareService', 'userDataService'];
dataShareService.$inject = ['$rootScope'];
userDataService.$inject = ['$resource'];






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