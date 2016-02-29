'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/navigation-bar.html',
        controller: 'NavigationController',
        controllerAs: 'vm',
        bindToController: true
    }
}