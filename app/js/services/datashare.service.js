'use strict';

module.exports = function ($rootScope) {
    var service = {
        data: false,
        blub: '',
        sendData: sendData,
        getData: getData,
        setBlub: setBlub,
        getBlub: getBlub
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
    
    function setBlub (newBlub) {
        service.blub = newBlub;
    }
    
    function getBlub () {
        return service.blub;
    }
};