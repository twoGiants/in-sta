'use strict';

module.exports = function ($rootScope) {
    var service = {
        data: false,
        sendData: sendData,
        getData: getData
    };
    return service;
    
    ////////////
    
    function sendData (data) {
        service.data = data;
        $rootScope.$broadcast('data_shared');
    }
    
    function getData () {
        return service.data;
    }
}