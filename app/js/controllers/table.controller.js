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
    
// OLD ==============================================================================    
    // call when navigation is used
    $scope.$on('data_shared', function () {
        var queryString = dataShareService.getData();
        
        table.data = userDataService.query({ item: queryString }, function () {
            statToolsService.calcGrowth(table.data[0].ig_user_statistics);
        }, function (err) {
            console.error('Internal Server Error: ' + err.data);
        });
    });
// OLD ==============================================================================
}


