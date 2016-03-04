'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/statistics-table.html',
        controller: 'TableController',
        controllerAs: 'table',
        bindToController: true
    }
}