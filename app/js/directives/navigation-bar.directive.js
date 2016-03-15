'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/navigation-bar.directive.html',
        controller: 'NavigationController',
        controllerAs: 'vm',
        bindToController: true
    };
};