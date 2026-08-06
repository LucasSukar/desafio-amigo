angular.module("amigoApp").controller("ModalEditarPerfilController", function ($scope, $modalInstance, PerfilService) {
  $scope.editando = {
    name:  $scope.usuario.name  || "",
    email: $scope.usuario.email || "",
  };

  $scope.trocarSenha = false;
  $scope.erro = null;
  $scope.salvando = false;

  $scope.salvarPerfil = function () {
    $scope.erro = null;

    if ($scope.trocarSenha) {
      if (!$scope.editando.oldPassword) {
        $scope.erro = "Informe a senha atual para trocar a senha.";
        return;
      }
      if (!$scope.editando.password || $scope.editando.password.length < 6) {
        $scope.erro = "A nova senha deve ter no mínimo 6 caracteres.";
        return;
      }
      if ($scope.editando.password !== $scope.editando.confirmPassword) {
        $scope.erro = "A nova senha e a confirmação não conferem.";
        return;
      }
    }

    var dadosParaEnviar = {};

    if ($scope.editando.name  && $scope.editando.name.trim())  dadosParaEnviar.name  = $scope.editando.name.trim();
    if ($scope.editando.email && $scope.editando.email.trim()) dadosParaEnviar.email = $scope.editando.email.trim();

    if ($scope.trocarSenha && $scope.editando.oldPassword) {
      dadosParaEnviar.oldPassword     = $scope.editando.oldPassword;
      dadosParaEnviar.password        = $scope.editando.password;
      dadosParaEnviar.confirmPassword = $scope.editando.confirmPassword;
    }

    if (Object.keys(dadosParaEnviar).length === 0) {
      $modalInstance.close();
      return;
    }

    $scope.salvando = true;

    PerfilService.putUser(dadosParaEnviar)
      .then(function (response) {
        $scope.salvando = false;
        if (response.data) {
          if (response.data.name)  $scope.usuario.name  = response.data.name;
          if (response.data.email) $scope.usuario.email = response.data.email;
        }
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
