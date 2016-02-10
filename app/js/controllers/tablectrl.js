'use strict';

module.exports = function ($scope, $filter, $http) {
    $http.get('/statistics').success(function (response) {
        // select which collection to display
        $scope.data = response[0];
        $scope.quantity = 14;

        // calculate growth
        for (var i in $scope.data.ig_user_statistics) {
            if (i < 1) {
                $scope.data.ig_user_statistics[i].growth = '---';
            } else {
                $scope.data.ig_user_statistics[i].growth = $scope.data.ig_user_statistics[i].followers - $scope.data.ig_user_statistics[i - 1].followers;
            }
        }

        // sort the table
        var orderBy = $filter('orderBy');
        $scope.order = function (predicate) {
            $scope.predicate = predicate;
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.data.ig_user_statistics = orderBy($scope.data.ig_user_statistics, predicate, $scope.reverse);
        };
        $scope.order('timestamp', true);
    });
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