'use strict';

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