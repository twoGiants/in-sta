'use strict';

module.exports = function ($scope, $filter, $http, dataShare) {
    // call on load
    $http.get('/statistics').success(function (response) {
        // setup --------------------------------------------------------
        $scope.data = response[1]; // select which collection to display
//        $scope.quantity = 21;      // how many rows to display
        $scope.calcGrowth($scope.data.ig_user_statistics); // calc growth    

        // sort the table
        var orderBy = $filter('orderBy');
        $scope.order = function (predicate) {
            $scope.predicate = predicate;
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.data.ig_user_statistics = orderBy($scope.data.ig_user_statistics, predicate, $scope.reverse);
        };
        $scope.order('date', true);
    });
    
    // call when navigation is used
    $scope.$on('data_shared', function () {
        var item = dataShare.getData();
        $http.get('/statistics/' + item).success(function (response) {
            console.log('Got the shizzle I requested from /statistics/' + item + '.');
            $scope.data = response[0];
            $scope.calcGrowth($scope.data.ig_user_statistics);
        }, function (response) { // error callback
            console.error('response.data: ' + response.data);
            console.error('response.status: ' + response.status);
        });
    });
    
    // TEST
    $scope.$on('TESTdata_shared', function () {
        var TESTitem = dataShare.getData();
        console.log(TESTitem);
        $http.get('/TEST/' + TESTitem).success(function (response) {
            console.log('Got the shizzle I requested from /TESTitem/' + TESTitem + '.');
            $scope.data = response[0];
        }, function (response) { // error callback
            console.error('response.data: ' + response.data);
            console.error('response.status: ' + response.status);
        });
    });
    
    // calculate growth
    $scope.calcGrowth = function (data) {
        for (var i in data) {
            if (i < 1) {
                data[i].growth = '---';
            } else {
                data[i].growth = data[i].followers - data[i - 1].followers;
            }
        }
    };
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