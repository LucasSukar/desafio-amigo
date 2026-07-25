angular
  .module("amigoApp")
  .controller("PerfilController", function ($scope, PerfilService) {
    $scope.publicacoes = [];
    $scope.postEditando = {};
    $scope.usuario = {};

    $scope.listaPosts = function () {
      PerfilService.getUserPosts()
        .then(function (response) {
          $scope.publicacoes = response.data;
        })
        .catch(function (error) {
          console.log("erro ao carregar publicações:", error);
        });
    };

    $scope.toggleOpcoes = function (pub) {
      pub.mostrarOpcoes = !pub.mostrarOpcoes;
    };

    $scope.prepararEdicao = function (pub) {
      $scope.postEditando = angular.copy(pub);
      pub.mostrarOpcoes = false;
      document.getElementById("modalEdicao").style.display = "block";
    };

    $scope.fecharModal = function () {
      document.getElementById("modalEdicao").style.display = "none";
    };

    $scope.salvarEdicao = function () {
      PerfilService.putPost($scope.postEditando.id, $scope.postEditando)
        .then(function () {
          $scope.fecharModal();
          $scope.listaPosts();
        })
        .catch(function (error) {
          console.log("erro ao editar publicação:", error);
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

    $scope.listaPosts();

    $scope.criaUser = function () {
      PerfilService.postUser($scope.usuario)
        .then(function (response) {
          console.log("usuário criado:", response.data);
          $scope.usuario = {};
        })
        .catch(function (error) {
          console.log("erro ao criar usuário:", error);
        });
    };
  });
