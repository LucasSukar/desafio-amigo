angular.module("amigoApp").controller("ModalEditarPerfilController", function ($scope, $modalInstance, PerfilService) {
  $scope.editando = {
    name:  $scope.usuario.name  || "",
    email: $scope.usuario.email || "",
  };

  $scope.trocarSenha = false;
  $scope.erro = null;
  $scope.salvando = false;
  $scope.avatarPreview = null; 
  $scope.avatarFile = null;     

  $scope.selecionarAvatar = function () {
    var fileInput = document.getElementById("input-avatar");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;

    $scope.avatarFile = fileInput.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
      $scope.$apply(function () {
        $scope.avatarPreview = e.target.result;
      });
    };
    reader.readAsDataURL($scope.avatarFile);
  };

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

    var temAlteracoes = Object.keys(dadosParaEnviar).length > 0;
    var temAvatar = !!$scope.avatarFile;

    if (!temAlteracoes && !temAvatar) {
      $modalInstance.close();
      return;
    }

    $scope.salvando = true;

    // Se tem foto, faz upload primeiro; depois salva os outros dados
    var uploadPromise = temAvatar
      ? (function () {
          var fd = new FormData();
          fd.append("avatar", $scope.avatarFile);
          return PerfilService.putAvatar(fd).then(function (response) {
            if (response.data && response.data.avatar_url) {
              $scope.usuario.avatar_url = response.data.avatar_url;
            }
          });
        })()
      : Promise.resolve();

    uploadPromise
      .then(function () {
        if (temAlteracoes) {
          return PerfilService.putUser(dadosParaEnviar).then(function (response) {
            if (response.data) {
              if (response.data.name)  $scope.usuario.name  = response.data.name;
              if (response.data.email) $scope.usuario.email = response.data.email;
            }
          });
        }
      })
      .then(function () {
        $scope.salvando = false;
        $modalInstance.close();
      })
      .catch(function (error) {
        $scope.salvando = false;
        if (error.data && error.data.error) {
          $scope.erro = error.data.error;
        } else {
          $scope.erro = "Erro ao salvar. Verifique os dados e tente novamente.";
        }
      });
  };

  $scope.cancelar = function () {
    $modalInstance.dismiss("cancel");
  };
});
