'use strict';

module.exports = function (dataShareService, userDataService) {   
    var vm = this;
    
    vm.navigation = [];
    vm.sendDataFromNavigationController = sendDataFromNavigationController;
    vm.loadNavigation = loadNavigation;
    
    loadNavigation();
    
    ////////////
    
    // broadcast selected navigation item
    function sendDataFromNavigationController(item) {
        console.log('Sending request from NavigationController: ' + item);
        dataShareService.sendData(item);
    }
    
    // requests username(months, years) for navigation from the be
    function loadNavigation() {
        vm.navigation = userDataService.nav();
    }
}