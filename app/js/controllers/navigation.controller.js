'use strict';

module.exports = function ($scope, $http, dataShareService) {

    // broadcast selected navigation item
    $scope.sendDataFromNavigationController = function (item) {
        console.log('Sending from NavigationController: ' + item);
        dataShareService.sendData(item);
    }

    // requests username(months, years) for navigation from the be
    $http.get('/nav').success(function (res) {
        $scope.navigation = res;
        console.log('Received navigation data: ' + $scope.navigation);
    }, function (err) {
        // error handling
        console.log('Error: ' + err.status);
    });
}