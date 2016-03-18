'use strict';

module.exports = function () {
    var service = {
        growth: false,
        calcGrowth: calcGrowth,
        queryStringForMostRecentTable: queryStringForMostRecentTable
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
    
    function queryStringForMostRecentTable(data) {
        var queryString = '';
        
        queryString = data.ig_user;
        queryString += '-'; 
        queryString += data.years_months[data.years_months.length - 1].months[data.years_months[data.years_months.length - 1].months.length - 1];
        queryString += '-';
        queryString += data.years_months[data.years_months.length - 1].year;
        
        return queryString;
    }
};