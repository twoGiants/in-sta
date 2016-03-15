'use strict';

require('angular');
require('angular-resource');

var config = require('./app.config');

// TODO
var statisticsTable = require('./directives/statisticstable');
// TODO
var navigationBar = require('./directives/navigationbar');

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
        'ngResource' 
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
    .filter('monthName', monthName);

config.$inject = ['$logProvider'];
TableController.$inject = ['$scope', '$log', 'dataShareService', 'statToolsService', 'userDataService'];
NavigationController.$inject = ['dataShareService', 'userDataService'];
dataShareService.$inject = ['$rootScope'];
userDataService.$inject = ['$resource'];