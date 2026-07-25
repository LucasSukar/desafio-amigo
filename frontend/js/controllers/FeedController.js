angular.module("amigoApp").controller("FeedController", function ($scope, FeedService) {
  $scope.publicacoes = [];
  $scope.postEditando = {};

  $scope.listaPosts = function () {
    FeedService.getPosts()
      .then(function (response) {
        $scope.posts = response.data;

        console.log("Dados da API:", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  $scope.deletePost = function(id) {
    if (confirm("Deseja apagar?")) {
      FeedService.deletePost(id).then(function() {
        $scope.listaPosts();
      }).catch(function(error) {
        console.log("Erro ao apagar:", error);
      });
    }
  };

  $scope.prepararEdicao = function(post) {
    $scope.postEditando = angular.copy(post);
    post.mostrarOpcoes = false;
    document.getElementById('modalEdicao').style.display = 'block';
  };

  $scope.salvarEdicao = function() {
    FeedService.putPost($scope.postEditando.id, $scope.postEditando).then(function() {
      document.getElementById('modalEdicao').style.display = 'none';
      $scope.listaPosts();
    }).catch(function(error) {
      console.log("Erro ao editar:", error);
    });
  };

  $scope.fecharModal = function() {
    document.getElementById('modalEdicao').style.display = 'none';
  };

  $scope.toggleOpcoes = function(post) {
    post.mostrarOpcoes = !post.mostrarOpcoes;
  };

  $scope.curtirPost = function (idDoPost){
    FeedService.postLike(idDoPost).then(function (response) {
      $scope.listaPosts();
    }).catch( function (error) {
      console.log("Erro ao dar like:", error);
    })
  }

  $scope.listaPosts();
});
