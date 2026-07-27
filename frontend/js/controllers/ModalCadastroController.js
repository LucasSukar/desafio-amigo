angular.module("amigoApp").controller("ModalCadastroController", function ($scope, $modalInstance, PerfilService) {
  $scope.usuario = {};

  $scope.criaUser = function () {
    PerfilService.postUser($scope.usuario)
      .then(function () {
        $modalInstance.close("created");
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
