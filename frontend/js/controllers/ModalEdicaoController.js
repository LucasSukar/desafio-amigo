angular.module("amigoApp").controller("ModalEdicaoController", function ($scope, $modalInstance, post, salvar) {
  $scope.post = angular.copy(post);
  $scope.salvando = false;

  $scope.salvar = function () {
    $scope.salvando = true;
    $scope.erro = null;

    salvar($scope.post.id, $scope.post)
      .then(function () {
        $modalInstance.close($scope.post);
      })
      .catch(function (error) {
        console.log("Erro ao editar:", error);
        $scope.erro = "Erro ao salvar. Tente novamente.";
        $scope.salvando = false;
      });
  };

  $scope.cancelar = function () {
    $modalInstance.dismiss("cancel");
  };
});
