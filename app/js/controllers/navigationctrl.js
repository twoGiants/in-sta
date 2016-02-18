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
    $http.get('/nav').success(function (response) {
        $scope.usernames = response;
        console.log('Received navigation data: ' + $scope.usernames[0].ig_user);
    }, function (error_response) {
        // error handling
        console.log('Error: ' + error_response.status);
    });

    var TESTMenuObj = {
        "stazzmatazz": {
            "2016": [
                "February"
            ]
        },
        "dummy": {
            "2015": [
                "December"
            ],
            "2016": [
                "January"
            ]
        }
    };
    $scope.shizzle = TESTMenuObj;
}