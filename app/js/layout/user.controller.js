'use strict';

module.exports = function ($log, userDataService) {
    var self = this;
    
    self.navigation = [];
    self.appName = 'Instagram Statistics';
    self.selected = null;
    self.selectUser = selectUser;
    
    // Load the navigation menu
    loadNavigation();
    
    ////////////
    
    function loadNavigation() {
        self.navigation = userDataService.nav(function() {
            self.selected = self.navigation[0].ig_user;
        }, function (err) { // error callback
            $log.error('Internal Server Error: ' + err.data);
        });
    }
    
    function selectUser(user) {
        self.selected = user;
        $log.debug(user);
    }
};