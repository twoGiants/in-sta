/* I have two controllers, NavigationController and TableController. They are independent.
TableController gets the user data from the db and displays it in a table.
NavigationController generates a navigation menu from the user data in the db. 
Each item in the navigation menu represents different user data. When a navigation item is clicked it emits an event and the TableController gets the according data from the db and displays it in the table.

WANT
When a navigation item is clicked, the TableController displays the according data, without using events.
*/
'use strict';

module.exports = function ($scope, dataShareService, statToolsService, userDataService) {
    var table = this;
    
    table.data = [];
    table.quantity = 14; // how many rows to display
    table.loadTable = loadTable;
    table.predicate = 'date';
    table.reverse = true;
    table.order = order;
    
    loadTable();
    
    ////////////
    
    function loadTable() {
        table.data = userDataService.stat(function() {
            statToolsService.calcGrowth(table.data[0].ig_user_statistics);
        }, function (err) { // error callback
            console.error('Internal Server Error: ' + err.data);
        });
    }
    
    function order(predicate) {
        table.reverse = (table.predicate === predicate) ? !table.reverse : false;
        table.predicate = predicate;
    }
    
    // call when navigation is used
    $scope.$on('data_shared', function () {
        var queryString = dataShareService.getData();
        
        table.data = userDataService.query({ item: queryString }, function () {
            statToolsService.calcGrowth(table.data[0].ig_user_statistics);
        }, function (err) {
            console.error('Internal Server Error: ' + err.data);
        });
    });
}


