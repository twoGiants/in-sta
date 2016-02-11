'use strict';

module.exports = function ($scope, $http, dataShare) {
    $scope.sendDataFromNavigationCtrl = function (data) {
        console.log('Sending data from navigationCtrl.');
        dataShare.sendData(data);
    }
    
    $http.get('/nav').success(function (response) {
        $scope.usernames = response;
        console.log('Received navigation data: ' + $scope.usernames[0].ig_user);
    }, function (error_response) {
        // error handling
        console.log('Error: ' + error_response.status);
    });
}