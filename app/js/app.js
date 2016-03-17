'use strict';

require('angular');
require('angular-resource');
require('angular-material');
require('angular-material-data-table');
require('angular-material-sidemenu');
require('./../css/app.css');

var config = require('./app.config');
var TableController = require('./layout/table.controller');
var NavigationController = require('./layout/navigation.controller');
var statisticsTable = require('./components/statistics-table.directive');
var navigationBar = require('./components/navigation-bar.directive');
var dataShareService = require('./services/datashare.service');
var statToolsService = require('./services/stattools.service');
var userDataService = require('./services/userdata.service');
var monthName = require('./filters/monthname');
var capitalize = require('./filters/capitalize');

var UserController = require('./layout/user.controller');

angular
    .module('inSta', [ 
        'ngResource',
        'ngMaterial',
        'md.data.table',
        'ngMaterialSidemenu'
    ]);

angular
    .module('inSta')
    .config(config)
    .controller('TableController', TableController)
    .controller('NavigationController', NavigationController)
    .directive('statisticsTable', statisticsTable)
    .directive('navigationBar', navigationBar)
    .factory('dataShareService', dataShareService)
    .factory('statToolsService', statToolsService)
    .factory('userDataService', userDataService)
    .filter('monthName', monthName)
    .filter('capitalize', capitalize)
    .controller('UserController', UserController);

config.$inject = ['$logProvider', '$mdThemingProvider'];
TableController.$inject = ['$scope', '$log', 'dataShareService', 'statToolsService', 'userDataService'];
NavigationController.$inject = ['$log', 'dataShareService', 'userDataService'];
dataShareService.$inject = ['$rootScope'];
userDataService.$inject = ['$resource'];

UserController.$inject = ['$log', 'userDataService'];