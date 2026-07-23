angular.module("amigoApp").config(function($routeProvider){
    $routeProvider.when("/", {
        templateUrl: "view/feed.html",
        controller: "FeedController"
    })
    .otherwise({
        redirectTo: "/"
    })
})
