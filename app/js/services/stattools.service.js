'use strict';

module.exports = function ($log) {
    var service = {
        growth: false,
        calcGrowth: calcGrowth,
        mostRecent: mostRecent
    };
    return service;

    ////////////

    function calcGrowth(data) {
        for (var i in data) {
            if (i < 1) {
                data[i].growth = '---';
            } else {
                data[i].growth = data[i].followers - data[i - 1].followers;
            }
        }
    }

    function mostRecent(userData) {
        var queryString = '';
        var month = null;
        var year = null;
        var obj = null;

        year = Math.max.apply(Math, userData.years_months.map(function (o) {
            return o.year;
        }));
        obj = userData.years_months.find(function (o) {
            return o.year == year;
        });
        month = Math.max.apply(Math, obj.months);

        queryString = userData.ig_user + '-' + month + '-' + year;
        
        return queryString;
    }
};