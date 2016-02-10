module.exports = function ($scope, $filter, $http) {
    $http.get('/statistics').success(function (response) {
        // select which collection to display
        $scope.data = response[1];
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