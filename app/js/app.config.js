'use strict';

module.exports = function ($logProvider, $mdThemingProvider, $mdIconProvider) {
    $logProvider.debugEnabled(true);
    
    $mdThemingProvider
        .theme('default');
    
    $mdIconProvider.icon("menu", "./assets/svg/menu.svg", 24);
};