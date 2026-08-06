angular.module("amigoApp").controller("ModalCadastroController", function ($scope, $modalInstance, PerfilService, LoginService) {
  $scope.usuario = {};

  $scope.criaUser = function () {
    PerfilService.postUser($scope.usuario)
      .then(function () {
        
        var credenciais = {
          email: $scope.usuario.email,
          password: $scope.usuario.password
        };
        return LoginService.logar(credenciais);
      })
      .then(function (response) {
        var token = response.data.token;
        var user = response.data.user;
        if (token) {
          LoginService.salvarToken(token, user ? user.id : null);
          $modalInstance.close("loggedIn");
        }
      })
      .catch(function (error) {
        console.log("Erro ao criar usuário:", error);
        $scope.erro = "Erro ao criar conta. Verifique os dados e tente novamente.";
      });
  };

  $scope.cancelar = function () {
    $modalInstance.dismiss("cancel");
  };
});
