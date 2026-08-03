angular.module("amigoApp").controller("ModalEditarPerfilController", function ($scope, $modalInstance, PerfilService) {
  $scope.usuario.oldPassword = undefined;
  $scope.usuario.password = undefined;
  $scope.usuario.confirmPassword = undefined;
  $scope.erro = null;
  $scope.salvando = false;

  $scope.salvarPerfil = function () {
    $scope.erro = null;

    if ($scope.usuario.password && $scope.usuario.password !== $scope.usuario.confirmPassword) {
      $scope.erro = "A nova senha e a confirmação de senha não conferem.";
      return;
    }

    $scope.salvando = true;

    var dadosParaEnviar = {};
    if ($scope.usuario.name) dadosParaEnviar.name = $scope.usuario.name;
    if ($scope.usuario.email) dadosParaEnviar.email = $scope.usuario.email;
    if ($scope.usuario.oldPassword) dadosParaEnviar.oldPassword = $scope.usuario.oldPassword;
    if ($scope.usuario.password) dadosParaEnviar.password = $scope.usuario.password;
    if ($scope.usuario.confirmPassword) dadosParaEnviar.confirmPassword = $scope.usuario.confirmPassword;

    if (Object.keys(dadosParaEnviar).length === 0) {
      $scope.salvando = false;
      $modalInstance.close();
      return;
    }

    PerfilService.putUser(dadosParaEnviar)
      .then(function (response) {
        $scope.salvando = false;
        $modalInstance.close(response.data);
      })
      .catch(function (error) {
        $scope.salvando = false;
        if (error.data && error.data.error) {
          $scope.erro = error.data.error;
        } else {
          $scope.erro = "Erro ao atualizar perfil. Verifique os dados e tente novamente.";
        }
      });
  };

  $scope.cancelar = function () {
    $modalInstance.dismiss("cancel");
  };
});
