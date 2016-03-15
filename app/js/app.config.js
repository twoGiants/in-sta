'use strict';

module.exports = function ($logProvider, $mdThemingProvider) {
    $logProvider.debugEnabled(true);
    
    $mdThemingProvider
        .theme('default');
};