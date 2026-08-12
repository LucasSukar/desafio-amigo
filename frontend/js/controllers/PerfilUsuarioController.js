angular.module("amigoApp").controller("PerfilUsuarioController", function (
  $scope,
  $routeParams,
  $location,
  $window,
  LoginService,
  UsuarioService
) {
  var userId = $routeParams.id;

  $scope.perfilUsuario = null;
  $scope.publicacoes = [];
  $scope.carregando = true;
  $scope.estaLogado = !!LoginService.obterToken();

  var currentUserId = LoginService.obterUserId();
  if (currentUserId && currentUserId == userId) {
    $location.path("/perfil");
    return;
  }

  $scope.carregarPerfil = function () {
    UsuarioService.getById(userId).then(function (response) {
      $scope.perfilUsuario = response.data;
    }).catch(function (err) {
      console.log("Erro ao carregar perfil:", err);
    });
  };

  $scope.carregarPosts = function () {
    $scope.carregando = true;
    UsuarioService.getPostsByUser(userId).then(function (response) {
      $scope.publicacoes = response.data;
      $scope.carregando = false;
    }).catch(function (err) {
      console.log("Erro ao carregar posts:", err);
      $scope.carregando = false;
    });
  };

  $scope.toggleFollow = function () {
    if (!$scope.estaLogado) {
      $location.path("/");
      return;
    }
    UsuarioService.toggleFollow(userId).then(function (response) {
      $scope.perfilUsuario.jaSigo = response.data.seguindo;
      if (response.data.seguindo) {
        $scope.perfilUsuario.total_seguidores++;
      } else {
        $scope.perfilUsuario.total_seguidores--;
      }
    }).catch(function (err) {
      console.log("Erro ao seguir/deixar de seguir:", err);
    });
  };

  $scope.voltar = function () {
    $window.history.back();
  };

  $scope.irParaChat = function () {
    $location.path("/chat/" + userId);
  };

  $scope.irParaPost = function (id) {
    $location.path("/post/" + id);
  };

  if (!$scope.estaLogado) {
    $location.path("/");
    return;
  }

  $scope.carregarPerfil();
  $scope.carregarPosts();
});
