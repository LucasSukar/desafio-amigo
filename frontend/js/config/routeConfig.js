angular.module("amigoApp").config(function($routeProvider){
    $routeProvider.when("/", {
        templateUrl: "view/feed.html",
        controller: "FeedController"
    })
    .otherwise({
        redirectTo: "/"
    });

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

    $routeProvider.when("/perfil/:id", {
      templateUrl: "view/perfil-usuario.html",
      controller: "PerfilUsuarioController"
    });

    $routeProvider.when("/seguindo", {
      templateUrl: "view/seguindo.html",
      controller: "SeguindoController"
    });

    $routeProvider.when("/feed-seguindo", {
      templateUrl: "view/feed.html",
      controller: "FeedSeguindoController"
    });

    $routeProvider.when("/chat", {
      templateUrl: "view/chat.html",
      controller: "ChatController"
    });

    $routeProvider.when("/chat/:userId", {
      templateUrl: "view/chat.html",
      controller: "ChatController"
    });
});
