angular.module("amigoApp").controller("PostController", function($scope, $routeParams, $location, FeedService, LoginService, $rootScope) {
  var postId = $routeParams.id;
  $scope.carregando = true;
  $scope.post = null;
  $scope.erro = null;

  $scope.estaLogado = !!LoginService.obterToken();

  var carregarPost = function() {
    $scope.carregando = true;
    FeedService.getPost(postId).then(function(response) {
      $scope.post = response.data;
      $scope.carregando = false;
    }).catch(function(error) {
      console.error(error);
      $scope.erro = "Não foi possível carregar a publicação.";
      $scope.carregando = false;
    });
  };

  $scope.curtirPost = function() {
    if (!$scope.estaLogado) {
      $rootScope.$broadcast("ABRIR_MODAL_LOGIN");
      return;
    }
    FeedService.postLike($scope.post.id).then(function(response) {
      $scope.post.total_likes = response.data.total_likes;
      $scope.post.jaCurtiu = response.data.jaCurtiu;
    }).catch(function(error) {
      console.error("Erro ao curtir:", error);
    });
  };

  $scope.voltarFeed = function() {
    $location.path("/");
  };

  carregarPost();
});
