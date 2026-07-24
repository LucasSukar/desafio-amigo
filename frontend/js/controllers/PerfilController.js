angular.module("amigoApp").controller("PerfilController", function($scope, PerfilService) {
  $scope.usuario = {};
  $scope.criaUser = function() {
    PerfilService.postUser( $scope.usuario ).then(function (response) {
      console.log("usuário criado:", response.data);
      $scope.usuario = {};
    }).catch(function (error) {
      console.log("erro ao criar usuário:", error);
    });
  };
});
