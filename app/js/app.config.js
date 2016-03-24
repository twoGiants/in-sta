'use strict';

module.exports = function ($provide, $logProvider, $mdThemingProvider, $mdIconProvider) {
    $provide.decorator('$log', ['$delegate', function ($delegate) {
        $delegate.jlog = function() {
            var args = [].slice.call(arguments);
            $delegate.log(JSON.stringify(args[0], 'null', '\t'));
        };
        
        return $delegate;
    }]);
    
    $logProvider.debugEnabled(true);
    
    $mdThemingProvider
        .theme('default');
    
    $mdIconProvider.icon("menu", "./assets/svg/menu.svg", 24);
};