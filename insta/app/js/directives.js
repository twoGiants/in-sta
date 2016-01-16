'use strict';

var inStaDirectives = angular.module('inStaDirectives', []);

inStaDirectives.directive('statisticsTable', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/statistics-table.html',
        controller: 'tableCtrl'
    }
});