'use strict';

module.exports = function ($scope, $http, dataShare) {

    // broadcast selected navigation item
    $scope.sendDataFromNavigationCtrl = function (item) {
        console.log('Sending from navigationCtrl: ' + item);
        dataShare.sendData(item);
    }
    
    $scope.TESTsendDataFromNavigationCtrl = function (TESTitem) {
        console.log('Sending TESTitem from navigationCtrl: ' + TESTitem);
        dataShare.TESTsendData(TESTitem);
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