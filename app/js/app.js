'use strict';

var angular = require('angular');
// TODO
require('angular-route');

// TODO
var statisticsTable = require('./directives/statisticstable');
// TODO
var navigationBar = require('./directives/navigationbar');

require('angular-resource');

var TableController = require('./controllers/table.controller');
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

TableController.$inject = ['$scope', 'dataShareService', 'statToolsService', 'userDataService'];
NavigationController.$inject = ['dataShareService', 'userDataService'];
dataShareService.$inject = ['$rootScope'];
userDataService.$inject = ['$resource'];
