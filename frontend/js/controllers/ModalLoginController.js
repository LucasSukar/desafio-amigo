angular.module("amigoApp").controller("ModalLoginController", function ($scope, $modalInstance, LoginService) {
  $scope.credenciais = {};

  $scope.fazerLogin = function () {
    LoginService.logar($scope.credenciais)
      .then(function (response) {
        var token = response.data.token;
        if (token) {
          LoginService.salvarToken(token);
          $modalInstance.close("loggedIn");
        }
      })
      .catch(function (error) {
        console.log("Erro de autenticação:", error);
        $scope.erro = "E-mail ou senha inválidos.";
      });
  };

  $scope.cancelar = function () {
    $modalInstance.dismiss("cancel");
  };
});
