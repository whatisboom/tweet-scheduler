var SchedulerController = function($scope, $http, $location) {
    
    $scope.tweet = {};
    $scope.data = {
        tweets: [],
        queues: []
    };

    $scope.queueTweet = function() {

        var data = {
            tweet: $scope.tweet
        };

        $http.post('/api/tweets', data)
            .success(function(response, status, headers, config) {
                $scope.data.tweets.push(response.data.tweet);
                $scope.tweet.text = "";
                $scope.tweet.queue = "";
                console.log($scope.tweets);
            });
    };

    $scope.logout = function() {
        $http.get('/logout').success(function(response, status, headers, config) {
            console.log(response);
            //$location.path($response.location);
        })
    };

    $http.get('/api/me')
        .success(function(response, status, headers, config) {
            $scope.user = response.meta.user;
        });

    $http.get('/api/tweets')
        .success(function(response, status, headers, config){
            $scope.tweets = response.data.tweets;
        });

};

angular.module('tweet-scheduler')
    .controller(['$scope', '$http', '$location', SchedulerController]);