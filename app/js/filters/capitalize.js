'use strict';

module.exports = function () {

    function capitalizeFilter(input, scope) {
        if (input !== null) {
            input = input.toLowerCase();
        } else {
            return '-';
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }

    return capitalizeFilter;
};