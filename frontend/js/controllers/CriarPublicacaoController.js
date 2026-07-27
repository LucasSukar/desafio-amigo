angular.module("amigoApp").controller("CriarPublicacaoController", function ($scope, FeedService, LoginService, $location) {
  var token = LoginService.obterToken();
  if (!token) {
    $location.path("/login");
    return;
  }

  $scope.novaPublicacao = {};
  $scope.publicando = false;

  $scope.voltarParaFeed = function () {
    $location.path("/");
  };

  $scope.publicar = function () {
    if (!$scope.novaPublicacao.title || !$scope.novaPublicacao.content) {
      $scope.erro = "Título e conteúdo são obrigatórios.";
      return;
    }

    $scope.publicando = true;
    $scope.erro = null;
    $scope.sucesso = null;

    $scope.novaPublicacao.resume = $scope.novaPublicacao.resume || "";
    $scope.novaPublicacao.data_publicacao = new Date().toISOString();

    FeedService.postPost($scope.novaPublicacao)
      .then(function () {
        $scope.sucesso = "Publicação criada com sucesso!";
        $scope.novaPublicacao = {};
        $scope.publicando = false;

        setTimeout(function () {
          $scope.$apply(function () {
            $location.path("/");
          });
        }, 1500);
      }).catch(function (error) {
        console.log("Erro ao criar publicação:", error);
        $scope.erro = "Erro ao criar publicação. Tente novamente.";
        $scope.publicando = false;
      });
  };
});
