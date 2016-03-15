'use strict';

/**
* @example <statistics-table></statistics-table>
*/
module.exports = function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/statistics-table.directive.html',
        controller: 'TableController',
        controllerAs: 'table',
        bindToController: true
    };
};