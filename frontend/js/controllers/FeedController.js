angular.module("amigoApp").controller("FeedController", function ($scope, FeedService, LoginService, $location, $modal) {
  $scope.posts = [];
  $scope.pagina = 1;
  $scope.carregando = false;
  $scope.semMaisPosts = false;
  $scope.estaLogado = !!LoginService.obterToken();

  $scope.irParaPerfil = function () {
    $location.path("/perfil");
  };

  $scope.irParaCriarPublicacao = function () {
    $location.path("/criar-publicacao");
  };

  $scope.deslogar = function () {
    LoginService.deslogar();
    $scope.estaLogado = false;
    $scope.posts = [];
    $scope.pagina = 1;
    $scope.semMaisPosts = false;
    $scope.listaPosts(1);
  };

  $scope.abrirModalLogin = function () {
    var modalInstance = $modal.open({
      templateUrl: "view/modal-login.html",
      controller: "ModalLoginController",
    });

    modalInstance.result.then(function (resultado) {
      if (resultado === "loggedIn") {
        $scope.estaLogado = true;
        $scope.posts = [];
        $scope.pagina = 1;
        $scope.semMaisPosts = false;
        $scope.listaPosts(1);
      }
    });
  };

  $scope.abrirModalCadastro = function () {
    var modalInstance = $modal.open({
      templateUrl: "view/modal-cadastro.html",
      controller: "ModalCadastroController",
    });

    modalInstance.result.then(function (resultado) {
      if (resultado === "created") {
        $scope.abrirModalLogin();
      }
    });
  };

  $scope.prepararEdicao = function (post) {
    post.mostrarOpcoes = false;

    var modalInstance = $modal.open({
      templateUrl: "view/modal-edicao.html",
      controller: "ModalEdicaoController",
      resolve: {
        post: function () { return post; },
        salvar: function () {
          return function (id, data) {
            return FeedService.putPost(id, data);
          };
        },
      },
    });

    modalInstance.result.then(function (postEditado) {
      for (var i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].id === postEditado.id) {
          $scope.posts[i].title = postEditado.title;
          $scope.posts[i].resume = postEditado.resume;
          $scope.posts[i].content = postEditado.content;
          break;
        }
      }
    });
  };


  $scope.listaPosts = function (pagina) {
    $scope.carregando = true;

    FeedService.getPosts(pagina || 1)
      .then(function (response) {
        var likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "{}");
        var novosPosts = response.data;

        for (var i = 0; i < novosPosts.length; i++) {
          novosPosts[i].jaCurtiu = !!likedPosts[novosPosts[i].id];
        }

        if (novosPosts.length === 0) {
          $scope.semMaisPosts = true;
        } else {
          $scope.posts = $scope.posts.concat(novosPosts);
        }
        $scope.carregando = false;
      })
      .catch(function (error) {
        console.log(error);
        $scope.carregando = false;
      });
  };

  $scope.deletePost = function (id) {
    if (confirm("Deseja apagar esta publicação?")) {
      FeedService.deletePost(id)
        .then(function () {
          $scope.posts = $scope.posts.filter(function (p) { return p.id !== id; });
        })
        .catch(function (error) {
          console.log("Erro ao apagar:", error);
        });
    }
  };

  $scope.toggleOpcoes = function (post) {
    post.mostrarOpcoes = !post.mostrarOpcoes;
  };

  $scope.curtirPost = function (post) {
    if (!$scope.estaLogado) {
      $scope.abrirModalLogin();
      return;
    }

    FeedService.postLike(post.id)
      .then(function () {
        var likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "{}");
        if (post.jaCurtiu) {
          if (post.total_likes > 0) {
            post.total_likes = post.total_likes - 1;
          }
          post.jaCurtiu = false;
          delete likedPosts[post.id];
        } else {
          post.total_likes = post.total_likes + 1;
          post.jaCurtiu = true;
          likedPosts[post.id] = true;
        }
        localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
      })
      .catch(function (error) {
        console.log("Erro ao curtir/descurtir:", error);
      });
  };


  var handleScroll = function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;

    if (!$scope.carregando && !$scope.semMaisPosts && scrollTop + clientHeight >= scrollHeight - 200) {
      $scope.$apply(function () {
        $scope.pagina++;
        $scope.listaPosts($scope.pagina);
      });
    }
  };

  window.addEventListener("scroll", handleScroll);

  $scope.$on("$destroy", function () {
    window.removeEventListener("scroll", handleScroll);
  });

  $scope.listaPosts(1);
});
