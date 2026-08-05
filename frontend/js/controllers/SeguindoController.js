angular.module("amigoApp").controller("SeguindoController", function (
  $scope,
  $location,
  LoginService,
  UsuarioService
) {
  if (!LoginService.obterToken()) {
    $location.path("/");
    return;
  }

  $scope.seguindo = [];
  $scope.carregando = true;

  $scope.carregarSeguindo = function () {
    $scope.carregando = true;
    UsuarioService.listarSeguindo().then(function (response) {
      $scope.seguindo = response.data;
      $scope.carregando = false;
    }).catch(function (err) {
      console.log("Erro ao carregar lista de seguindo:", err);
      $scope.carregando = false;
    });
  };

  $scope.deixarDeSeguir = function (usuario) {
    UsuarioService.toggleFollow(usuario.id).then(function () {
      $scope.seguindo = $scope.seguindo.filter(function (u) { return u.id !== usuario.id; });
    }).catch(function (err) {
      console.log("Erro ao deixar de seguir:", err);
    });
  };

  $scope.irParaPerfil = function (userId) {
    $location.path("/perfil/" + userId);
  };

  $scope.voltar = function () {
    $location.path("/");
  };

  $scope.carregarSeguindo();
});
