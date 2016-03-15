'use strict';

module.exports = function ($log, dataShareService, userDataService) {   
    var vm = this;
    
    vm.navigation = [];
    vm.sendDataFromNavigationController = sendDataFromNavigationController;
    vm.loadNavigation = loadNavigation;
    vm.blub = dataShareService.getBlub();
    
    loadNavigation();
    
    ////////////
    
    // broadcast selected navigation item
    function sendDataFromNavigationController(item) {
        $log.log('Sending request from NavigationController: ' + item);
        dataShareService.sendData(item);
        blub(item);
    }
    
    function blub(item) {
        dataShareService.setBlub(item);
        vm.blub = dataShareService.getBlub();
    }
    
    // requests username(months, years) for navigation from the be
    function loadNavigation() {
        vm.navigation = userDataService.nav();
    }
};