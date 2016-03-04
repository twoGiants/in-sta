'use strict';

module.exports = function ($scope, $http, dataShareService, statToolsService) {
    var table = this;
    
    table.data = [];
    table.loadTable = loadTable;
    table.predicate = 'date';
    table.reverse = true;
    table.order = order;
    
    loadTable();
    
    ////////////
    
    function loadTable() {
        $http.get('/statistics').success(function (response) {
            table.data = response[0]; // select which collection to display
            table.quantity = 14;      // how many rows to display
            statToolsService.calcGrowth(table.data.ig_user_statistics); // calc and set growth
        });
    }
    
    function order(predicate) {
        table.reverse = (table.predicate === predicate) ? !table.reverse : false;
        table.predicate = predicate;
    }
    
// OLD ==============================================================================    
    // call when navigation is used
    $scope.$on('data_shared', function () {
        var item = dataShareService.getData();
        $http.get('/statistics/' + item).success(function (response) {
            console.log('Got the data I requested for /statistics/' + item + '.');
            table.data = response[0];
            statToolsService.calcGrowth(table.data.ig_user_statistics);
        }, function (response) { // error callback
            console.error('response.data: ' + response.data);
            console.error('response.status: ' + response.status);
        });
    });
// OLD ==============================================================================
}


// Example code ---------------------------------------------------
// note AddContact bugfix in the comments of the tutorial video
/*inStaControllers.controller('view1Ctrl', ['$scope', '$http', function ($scope, $http) {
    $scope.message = 'This is the view1 screen.';

    var refresh = function () {
        $http.get('/statistics_').success(function (response) {
            console.log("Got the data I requested");
            $scope.contactlist = response;
            $scope.contact = "";
        });
    };

    refresh();

    $scope.addContact = function () {
        console.log($scope.contact);
        $http.post('/contactlist', $scope.contact).success(function (response) {
            console.log(response);
            refresh();
        });
    };

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/contactlist/' + id).success(function (response) {
            refresh();
        });
    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/contactlist/' + id).success(function (response) {
            $scope.contact = response;
        });
    };

    $scope.update = function () {
        console.log($scope.contact._id);
        $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function (response) {
            refresh();
        });
    };

    $scope.deselect = function () {
        $scope.contact = "";
    };
}]);

inStaControllers.controller('view2Ctrl', function ($scope) {
    $scope.message = 'This is the view2 screen.';
});

inStaControllers.controller('calcCtrl', function ($scope, calcService) {
    $scope.formData = {};

    $scope.doSquare = function () {
        $scope.answer = calcService.square($scope.formData.number);
    };

    $scope.doCube = function (number) {
        $scope.answer = calcService.cube($scope.formData.number);
    };
});*/