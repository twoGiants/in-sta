'use strict';

module.exports = function ($log, userDataService, statToolsService) {
    var self = this;
    
    self.navigation = [];
    self.appName = 'Instagram Statistics';
    self.selected = null;
    self.selectUser = selectUser;
    self.userData = null;
    self.queryUserData = queryUserData;
    self.temp = null;
    
    // Load the navigation menu
    loadNavigation();
    
    ////////////
    function loadNavigation() {
        self.navigation = userDataService.nav(function() {
            var queryString = '';
            
            self.selected = self.navigation[0].ig_user;
            queryString = 'obamasan-12-2014';
            
            // get table data for selected user
            self.userData = userDataService.query({ item: queryString }, function () {
                // calc growth
                statToolsService.calcGrowth(self.userData[0].ig_user_statistics);
            }, function (err) {
                $log.error('Internal Server Error: ' + err.data);
            });
        }, function (err) { // error callback
            $log.error('Internal Server Error: ' + err.data);
        });
    }
    
    function queryUserData(queryString) {
        self.temp = queryString;
        self.userData = userDataService.query({ item: queryString }, function () {
            // calc growth
            statToolsService.calcGrowth(self.userData[0].ig_user_statistics);
        }, function (err) {
            $log.error('Internal Server Error: ' + err.data);
        });
    }
    
    function selectUser(user) {
        self.selected = user;
    }
};