angular.module("amigoApp").controller("FeedController", function ($scope, FeedService, LoginService, $location) {
  $scope.publicacoes = [];
  $scope.postEditando = {};

  $scope.irParaPerfil = function() {
    var token = LoginService.obterToken();
    if (token) {
      $location.path("/perfil");
    } else {
      $location.path("/login");
    }
  };

  $scope.irParaCriarPublicacao = function() {
    var token = LoginService.obterToken();
    if (token) {
      $location.path("/criar-publicacao");
    } else {
      $location.path("/login");
    }
  };

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

  $scope.irParaLogin = function() {
    $location.path("/login");
  };

  $scope.curtirPost = function (post){
    var token = LoginService.obterToken();
    if (!token) {
      post.tentouCurtirDeslogado = true;
      return;
    }

    FeedService.postLike(post.id).then(function (response) {
      $scope.listaPosts();
    }).catch( function (error) {
      console.log("Erro ao dar like:", error);
    })
  }

  $scope.listaPosts();
});
