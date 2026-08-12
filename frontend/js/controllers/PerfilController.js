angular.module("amigoApp").controller("PerfilController", function ($scope, PerfilService, LoginService, UsuarioService, $location, $modal, $window) {
  if (!LoginService.obterToken()) {
    $location.path("/");
    return;
  }

  $scope.publicacoes = [];
  $scope.usuario = {};
  $scope.modalAberta = false;

  $scope.carregarUsuario = function () {
    PerfilService.getMe()
      .then(function (response) {
        $scope.usuario = response.data;
      })
      .catch(function (error) {
        console.log("erro ao carregar usuário:", error);
      });
  };

  $scope.listaPosts = function () {
    PerfilService.getUserPosts()
      .then(function (response) {
        $scope.publicacoes = response.data;
      })
      .catch(function (error) {
        console.log("erro ao carregar publicações:", error);
      });
  };

  $scope.toggleOpcoes = function (pub, $event) {
    if ($event) $event.stopPropagation();
    var estavaAberto = pub.mostrarOpcoes;
    $scope.publicacoes.forEach(function (p) {
      p.mostrarOpcoes = false;
    });
    pub.mostrarOpcoes = !estavaAberto;
  };

  $scope.irParaPost = function (id) {
    $location.path("/post/" + id);
  };

  $scope.prepararEdicao = function (pub) {
    if ($scope.modalAberta) return;
    $scope.modalAberta = true;
    pub.mostrarOpcoes = false;

    var modalInstance = $modal.open({
      templateUrl: "view/modal-edicao.html",
      controller: "ModalEdicaoController",
      resolve: {
        post: function () { return pub; },
        salvar: function () {
          return function (id, data) {
            return PerfilService.putPost(id, data);
          };
        },
      },
    });

    modalInstance.result.then(function () {
      $scope.listaPosts();
    }).finally(function () {
      $scope.modalAberta = false;
    });
  };

  $scope.deletar = function (id) {
    if (confirm("Deseja apagar?")) {
      PerfilService.deletePost(id)
        .then(function () {
          $scope.listaPosts();
        })
        .catch(function (error) {
          console.log("erro ao apagar publicação:", error);
        });
    }
  };

  $scope.voltarParaFeed = function () {
    $location.path("/");
  };

  $scope.irParaChat = function () {
    $location.path("/chat");
  };

  $scope.deslogar = function () {
    LoginService.deslogar();
    $location.path("/");
  };

  $scope.excluirConta = function () {
    if (!confirm("Tem certeza? Essa ação é IRREVERSÍVEL.\nTodos os seus posts, comentários e dados serão apagados.")) return;
    UsuarioService.deleteAccount().then(function () {
      LoginService.deslogar();
      localStorage.clear();
      $window.location.href = "/";
      $window.location.reload();
    }).catch(function (err) {
      alert("Erro ao excluir conta: " + (err.data && err.data.error ? err.data.error : "Tente novamente."));
    });
  };

  $scope.abrirModalEditarPerfil = function () {
    if ($scope.modalAberta) return;
    $scope.modalAberta = true;

    var modalInstance = $modal.open({
      templateUrl: "view/modal-editar-perfil.html",
      controller: "ModalEditarPerfilController",
      windowClass: "modal-large",
      scope: $scope
    });

    modalInstance.result.then(function () {
      $scope.carregarUsuario();
    }).finally(function () {
      $scope.modalAberta = false;
    });
  };


  $scope.criaUser = function () {
    PerfilService.postUser($scope.usuario)
      .then(function (response) {
        console.log("usuário criado:", response.data);
      })
      .catch(function (error) {
        console.log("erro ao criar usuário:", error);
      });
  };

  $scope.putAvatar = function () {
    var fileInput = document.getElementById("input-avatar");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;

    var fd = new FormData();
    fd.append("avatar", fileInput.files[0]);

    PerfilService.putAvatar(fd)
      .then(function (response) {
        console.log("avatar atualizado:", response.data);
        $scope.usuario.avatar_url = response.data.avatar_url;
      })
      .catch(function (error) {
        console.log("erro ao atualizar avatar:", error);
      });
  };

  $scope.listaPosts();
  $scope.carregarUsuario();
});
