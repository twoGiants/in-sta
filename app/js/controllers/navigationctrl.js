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
    
    var testMenuObj = {
        "user1": {
            "2016": ["January", "February", "March"]
        },
        "user2": {
            "2016": ["January", "February", "March"],
            "2015": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        },
    };
    $scope.shizzle = testMenuObj;
}









