var SchedulerController = function($scope, $http) {
    $scope.title = "lol";

    $http.get('/api/user').success(function(response, status, headers, config) {
        $scope.user = response.meta.user;
    });
};

angular.module('tweet-scheduler')
    .controller(['$scope', '$http', SchedulerController]);