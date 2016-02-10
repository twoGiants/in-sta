'use strict';

module.exports = function ($scope) {
    $scope.sendData = function(navPoint) {
        console.log('You just clicked: ' + navPoint);
    }
}