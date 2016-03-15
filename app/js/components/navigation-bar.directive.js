'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        templateUrl: 'js/components/navigation-bar.directive.html',
        controller: 'NavigationController',
        controllerAs: 'vm',
        bindToController: true
    };
};