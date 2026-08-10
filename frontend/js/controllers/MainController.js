angular.module("amigoApp").controller("MainController", function (
  $scope,
  $location,
  $modal,
  $window,
  LoginService,
  PerfilService,
  UsuarioService
) {
  $scope.estaLogado = !!LoginService.obterToken();
  $scope.usuario = null;
  $scope.todosUsuarios = [];
  $scope.searchText = "";
  $scope.mostrarListaUsuarios = false;

  var carregarUsuarioGlobal = function () {
    if ($scope.estaLogado) {
      PerfilService.getMe().then(function (response) {
        $scope.usuario = response.data;
      }).catch(function () {
        $scope.deslogar();
      });
    }
  };

  var carregarUsuarios = function () {
    if ($scope.estaLogado) {
      UsuarioService.listarTodos().then(function (response) {
        $scope.todosUsuarios = response.data;
      }).catch(function (err) {
        console.log("Erro ao carregar usuários:", err);
      });
    }
  };

  carregarUsuarioGlobal();
  carregarUsuarios();

  $scope.$on('loginStateChanged', function () {
    $scope.estaLogado = !!LoginService.obterToken();
    carregarUsuarioGlobal();
    carregarUsuarios();
  });

  $scope.onSearchFocus = function () {
    $scope.mostrarListaUsuarios = true;
  };

  $scope.onSearchBlur = function () {
    setTimeout(function () {
      $scope.$apply(function () {
        $scope.mostrarListaUsuarios = false;
      });
    }, 200);
  };

  $scope.seguirUsuario = function (usuario, $event) {
    if ($event) $event.stopPropagation();
    UsuarioService.toggleFollow(usuario.id).then(function (response) {
      usuario.jaSigo = response.data.seguindo;
    }).catch(function (err) {
      console.log("Erro ao seguir:", err);
    });
  };

  $scope.irParaPerfilUsuario = function (userId) {
    $scope.mostrarListaUsuarios = false;
    $scope.searchText = "";
    $location.path("/perfil/" + userId);
  };

  $scope.irParaFeed = function () {
    $location.path("/");
  };

  $scope.irParaFeedSeguindo = function () {
    $location.path("/feed-seguindo");
  };

  $scope.irParaPerfil = function () {
    $location.path("/perfil");
  };

  $scope.irParaSeguindo = function () {
    $location.path("/seguindo");
  };

  $scope.irParaCriarPublicacao = function () {
    $location.path("/criar-publicacao");
  };

  $scope.deslogar = function () {
    LoginService.deslogar();
    localStorage.removeItem("liked_posts");
    $scope.estaLogado = false;
    $scope.usuario = null;
    $scope.todosUsuarios = [];
    $window.location.href = "/";
    $window.location.reload();
  };

  $scope.abrirModalLogin = function () {
    var modalInstance = $modal.open({
      templateUrl: 'view/modal-login.html',
      controller: 'ModalLoginController',
      windowClass: 'modal-login'
    });

    modalInstance.result.then(function () {
      $window.location.href = "/";
      $window.location.reload();
    });
  };

  $scope.abrirModalCadastro = function () {
    var modalInstance = $modal.open({
      templateUrl: 'view/modal-cadastro.html',
      controller: 'ModalCadastroController',
      windowClass: 'modal-cadastro'
    });

    modalInstance.result.then(function (resultado) {
      if (resultado === "loggedIn") {
        $window.location.href = "/";
        $window.location.reload();
      }
    });
  };
});
