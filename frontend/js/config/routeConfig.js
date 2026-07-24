angular.module("amigoApp").config(function($routeProvider){
    $routeProvider.when("/", {
        templateUrl: "view/feed.html",
        controller: "FeedController"
    })
    .otherwise({
        redirectTo: "/"
    })

    $routeProvider.when("/perfil", {
      templateUrl: "view/perfil.html",
      controller: "PerfilController"
    });

    $routeProvider.when("/login", {
      templateUrl: "view/login.html",
      controller: "LoginController"
    });
})
