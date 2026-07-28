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

    $routeProvider.when("/cadastro", {
      templateUrl: "view/cadastro.html",
      controller: "PerfilController"
    });

    $routeProvider.when("/criar-publicacao", {
      templateUrl: "view/criar-publicacao.html",
      controller: "CriarPublicacaoController"
    });

    $routeProvider.when("/post/:id", {
      templateUrl: "view/post.html",
      controller: "PostController"
    });
})
