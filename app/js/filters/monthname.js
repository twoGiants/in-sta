'use strict';

module.exports = function monthName() {
    return function (monthNumber) {
        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        return monthNames[monthNumber - 1];
    };
};