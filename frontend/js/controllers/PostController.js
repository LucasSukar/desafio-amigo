angular.module("amigoApp").controller("PostController", function($scope, $routeParams, $location, FeedService, LoginService, $modal, $window) {
  var postId = $routeParams.id;
  $scope.carregando = true;
  $scope.post = null;
  $scope.erro = null;
  $scope.modalAberta = false;
  $scope.comentarios = [];
  $scope.form = { novoComentario: "" };
  $scope.enviandoComentario = false;

  $scope.estaLogado = function() { return !!LoginService.obterToken(); };
  $scope.currentUserId = function() { return LoginService.obterUserId(); };

  var carregarPost = function() {
    $scope.carregando = true;
    FeedService.getPost(postId).then(function(response) {
      var posts = FeedService.aplicarCurtidas([response.data]);
      $scope.post = posts[0];
      $scope.carregando = false;
    }).catch(function(error) {
      console.error(error);
      $scope.erro = "Não foi possível carregar a publicação.";
      $scope.carregando = false;
    });
  };

  $scope.carregarComentarios = function() {
    FeedService.getComments(postId).then(function(response) {
      $scope.comentarios = response.data;
    }).catch(function(error) {
      console.error("Erro ao carregar comentários:", error);
    });
  };

  $scope.enviarComentario = function() {
    var texto = $scope.form.novoComentario;
    if (!texto || texto.trim() === "") return;
    if ($scope.enviandoComentario) return;

    $scope.enviandoComentario = true;
    FeedService.postComment(postId, texto).then(function(response) {
      $scope.comentarios.push(response.data);
      $scope.form.novoComentario = "";
    }).catch(function(error) {
      console.error("Erro ao enviar comentário:", error);
    }).finally(function() {
      $scope.enviandoComentario = false;
    });
  };

  $scope.apagarComentario = function(comentario) {
    if (!confirm("Deseja apagar este comentário?")) return;
    FeedService.deleteComment(postId, comentario.id).then(function() {
      $scope.comentarios = $scope.comentarios.filter(function(c) {
        return c.id !== comentario.id;
      });
    }).catch(function(error) {
      console.error("Erro ao apagar comentário:", error);
    });
  };

  $scope.abrirModalLogin = function() {
    if ($scope.modalAberta) return;
    $scope.modalAberta = true;

    var modalInstance = $modal.open({
      templateUrl: "view/modal-login.html",
      controller: "ModalLoginController",
    });

    modalInstance.result.then(function(resultado) {
      if (resultado === "loggedIn") {
        $window.location.reload();
      }
    }).finally(function() {
      $scope.modalAberta = false;
    });
  };

  $scope.curtirPost = function() {
    if (!LoginService.obterToken()) {
      $scope.abrirModalLogin();
      return;
    }
    FeedService.toggleLike($scope.post).catch(function(error) {
      console.error("Erro ao curtir:", error);
    });
  };

  $scope.voltarFeed = function() {
    $window.history.back();
  };

  $scope.irParaPerfilUsuario = function(userId) {
    var currentUserId = LoginService.obterUserId();
    if (currentUserId && currentUserId == userId) {
      $location.path("/perfil");
    } else {
      $location.path("/perfil/" + userId);
    }
  };

  carregarPost();
  $scope.carregarComentarios();
});
