angular.module("amigoApp").controller("MainController", function(
  $scope,
  $location,
  $modal,
  $window,
  LoginService,
  PerfilService
) {
  $scope.estaLogado = !!LoginService.obterToken();
  $scope.usuario = null;

  var carregarUsuarioGlobal = function() {
    if ($scope.estaLogado) {
      PerfilService.getMe().then(function(response) {
        $scope.usuario = response.data;
      }).catch(function() {
        $scope.deslogar();
      });
    }
  };

  carregarUsuarioGlobal();

  $scope.$on('loginStateChanged', function() {
    $scope.estaLogado = !!LoginService.obterToken();
    carregarUsuarioGlobal();
  });

  $scope.irParaFeed = function() {
    $location.path("/");
  };

  $scope.irParaPerfil = function() {
    $location.path("/perfil");
  };

  $scope.irParaCriarPublicacao = function() {
    $location.path("/criar-publicacao");
  };

  $scope.deslogar = function() {
    LoginService.deslogar();
    localStorage.removeItem("liked_posts");
    $scope.estaLogado = false;
    $scope.usuario = null;
    $window.location.href = "/";
    $window.location.reload();
  };

  $scope.abrirModalLogin = function() {
    var modalInstance = $modal.open({
      templateUrl: 'view/modal-login.html',
      controller: 'ModalLoginController',
      windowClass: 'modal-login'
    });

    modalInstance.result.then(function() {
      $window.location.href = "/";
      $window.location.reload();
    });
  };

  $scope.abrirModalCadastro = function() {
    var modalInstance = $modal.open({
      templateUrl: 'view/modal-cadastro.html',
      controller: 'ModalCadastroController',
      windowClass: 'modal-cadastro'
    });

    modalInstance.result.then(function(resultado) {
      if (resultado === "loggedIn") {
        $window.location.href = "/";
        $window.location.reload();
      }
    });
  };
});
