'use strict';

module.exports = function ($scope, $http, dataShare) {
    
    // broadcast selected navigation item
    $scope.sendDataFromNavigationCtrl = function (item) {
        dataShare.sendData(item);
    }
    
    // requests usernames for navigation from the be
    $http.get('/nav').success(function (response) {
        $scope.usernames = response;
        console.log('Received navigation data: ' + $scope.usernames[0].ig_user);
    }, function (error_response) {
        // error handling
        console.log('Error: ' + error_response.status);
    });
}