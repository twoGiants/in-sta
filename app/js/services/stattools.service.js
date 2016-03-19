'use strict';

module.exports = function () {
    var service = {
        growth: false,
        calcGrowth: calcGrowth
    };
    return service;
    
    ////////////
    
    function calcGrowth (data) {
        for (var i in data) {
            if (i < 1) {
                data[i].growth = '---';
            } else {
                data[i].growth = data[i].followers - data[i - 1].followers;
            }
        }
    }
};