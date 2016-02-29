'use strict';

module.exports = function ($http, dataShareService) {
    var vm = this;
    
    vm.navigation = [];
    vm.sendDataFromNavigationController = sendDataFromNavigationController;
    vm.loadNavigation = loadNavigation;
    
    loadNavigation();
    
    ////////////
    
    // broadcast selected navigation item
    function sendDataFromNavigationController(item) {
        console.log('Sending from NavigationController: ' + item);
        dataShareService.sendData(item);
    }
    
    // requests username(months, years) for navigation from the be
    function loadNavigation() {
        $http.get('/nav').success(function (res) {
            vm.navigation = res;
            console.log('Received navigation data: ' + vm.navigation);
        }, function (err) {
            // error handling
            console.log('Error: ' + err.status);
        });
    }
}