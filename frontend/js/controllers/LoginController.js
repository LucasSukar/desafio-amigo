angular.module("amigoApp").controller("LoginController", function($scope, LoginService, $location) {
  $scope.credenciais = {};

  $scope.fazerLogin = function() {
    LoginService.logar( $scope.credenciais ).then(function(response) {
      const token = response.data.token;
      if (token) {
        LoginService.salvarToken(token);
        $location.path("/");
      }
    }).catch(function(error) {
      console.log("Erro de autenticação:", error);
      $scope.erro = "E-mail ou senha inválidos.";
    });
  };
});
