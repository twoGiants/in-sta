'use strict';

module.exports = function ($log, userDataService, statToolsService) {
    var self = this;
    
    self.navigation = [];
    self.appName = '';
    self.selected = null;
    self.userData = null;
    self.selectUser = selectUser;
    self.queryUserData = queryUserData;
    
    // Load the navigation menu when the app starts
    loadNavigation();
    self.appName = 'Instagram Statistics';
    
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