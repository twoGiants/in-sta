'use strict';

require('angular');
require('angular-resource');
require('angular-material');
require('angular-material-data-table');
require('angular-material-sidemenu');
require('./../css/app.css');

var config = require('./app.config');
var UserController = require('./layout/user.controller');
var statToolsService = require('./services/stattools.service');
var userDataService = require('./services/userdata.service');
var monthName = require('./filters/monthname');
var capitalize = require('./filters/capitalize');


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
    .controller('UserController', UserController)
    .factory('statToolsService', statToolsService)
    .factory('userDataService', userDataService)
    .filter('monthName', monthName)
    .filter('capitalize', capitalize);

config.$inject = ['$provide', '$logProvider', '$mdThemingProvider', '$mdIconProvider'];
UserController.$inject = ['$log', '$mdSidenav', 'userDataService', 'statToolsService'];
userDataService.$inject = ['$resource'];
statToolsService.$inject = ['$log'];
