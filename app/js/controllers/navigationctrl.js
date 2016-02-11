'use strict';

module.exports = function ($scope, dataShare) {
    $scope.sendTheD = function (navPoint) {
        dataShare.sendData(navPoint);
    }
}