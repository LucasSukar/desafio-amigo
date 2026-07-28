angular.module("amigoApp").controller("PerfilController", function ($scope, PerfilService, LoginService, $location, $modal) {
    if (!LoginService.obterToken()) {
      $location.path("/");
      return;
    }

    $scope.publicacoes = [];
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

    $scope.deslogar = function () {
      LoginService.deslogar();
      $location.path("/");
    };

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

    $scope.listaPosts();
  });
