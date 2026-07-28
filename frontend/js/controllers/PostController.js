angular.module("amigoApp").controller("PostController", function($scope, $routeParams, $location, FeedService, LoginService, $modal) {
  var postId = $routeParams.id;
  $scope.carregando = true;
  $scope.post = null;
  $scope.erro = null;
  $scope.modalAberta = false;

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

  $scope.abrirModalLogin = function() {
    if ($scope.modalAberta) return;
    $scope.modalAberta = true;

    var modalInstance = $modal.open({
      templateUrl: "view/modal-login.html",
      controller: "ModalLoginController",
    });

    modalInstance.result.then(function(resultado) {
      if (resultado === "loggedIn") {
        $scope.estaLogado = true;
      }
    }).finally(function() {
      $scope.modalAberta = false;
    });
  };

  $scope.curtirPost = function() {
    if (!$scope.estaLogado) {
      $scope.abrirModalLogin();
      return;
    }
    FeedService.toggleLike($scope.post).catch(function(error) {
      console.error("Erro ao curtir:", error);
    });
  };

  $scope.voltarFeed = function() {
    $location.path("/");
  };

  carregarPost();
});
