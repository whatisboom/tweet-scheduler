angular.module('tweet-scheduler',['ngRoute'])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    if (history.pushState) {
        $locationProvider.html5Mode(true);
    }

    $routeProvider
    .when('/', {
        templateUrl: '/public/partials/scheduler.html',
        controller: 'SchedulerController'
    })
    .when('/scheduler', {
        templateUrl: '/public/partials/scheduler.html',
        controller: 'SchedulerController'
    })
    .otherwise({
        redirectTo: '/'
    });

}]);