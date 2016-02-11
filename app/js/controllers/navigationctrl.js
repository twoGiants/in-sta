'use strict';

module.exports = function ($scope, $http, dataShare) {
    $scope.sendDataFromNavigationToCtrl = function (data) {
        console.log('Sending data from navigationCtrl.');
        dataShare.sendData(data);
    }
    
    $http.get('/nav').success(function (response) {
        $scope.navigationData = response;
        console.log('Received navigation data: ' + $scope.navigationData);
    }, function (error_response) {
        // error handling
        console.log('Error: ' + error_response.status);
    });
}