'use strict';

module.exports = function ($log, $mdSidenav, userDataService, statToolsService) {
    var self = this;
    
    self.navigation = [];
    self.appName    = '';
    self.tableOrder = '';
    self.userData   = null;
    self.tableCaption  = '';
    self.queryUserData = queryUserData;
    self.toggleMenu    = toggleMenu;
    
    // init
    loadNavigation();
    self.appName = 'Instagram Statistics';
    self.tableOrder = '-date';
    
    ////////////
    
    function loadNavigation() {
        self.navigation = userDataService.nav(function() {
            var navOrder = '';
            
            // order navigation
            navOrder = self.navigation.pop();
            statToolsService.reorder(navOrder.usernames, self.navigation);
            // get query string from navigation object
            self.selectedNavItem = statToolsService.mostRecent(self.navigation[0]);
            
            // get table data for selected user
            self.userData = userDataService.query({ item: self.selectedNavItem }, function () {
                // calc growth
                statToolsService.calcGrowth(self.userData[0].ig_user_statistics);
                // table caption
                self.tableCaption = statToolsService.getTableCaption(self.userData[0]);
                
            }, function (err) {
                $log.error('Internal Server Error: ' + err.data);
            });
        }, function (err) { // error callback
            $log.error('Internal Server Error: ' + err.data);
        });
    }
    
    function queryUserData(queryString) {
        self.selectedNavItem = queryString;
        self.userData = userDataService.query({ item: queryString }, function () {
            // calc growth
            statToolsService.calcGrowth(self.userData[0].ig_user_statistics);
            self.tableCaption = statToolsService.getTableCaption(self.userData[0]);
            
        }, function (err) {
            $log.error('Internal Server Error: ' + err.data);
        });
    }
    
    function toggleMenu() {
        $mdSidenav('left').toggle();
    }
};