angular.module("amigoApp").controller("CriarPublicacaoController", function ($scope, FeedService, LoginService, $location) {
  var token = LoginService.obterToken();
  if (!token) { $location.path("/"); return; }

  $scope.novaPublicacao = {};
  $scope.publicando = false;
  $scope.imagemPreview = null;
  $scope.imagemFile = null;

  $scope.voltarParaFeed = function () { $location.path("/"); };

  $scope.selecionarImagem = function () {
    var fileInput = document.getElementById("input-imagem-post");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    $scope.imagemFile = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      $scope.$apply(function () { $scope.imagemPreview = e.target.result; });
    };
    reader.readAsDataURL($scope.imagemFile);
  };

  $scope.removerImagem = function () {
    $scope.imagemPreview = null;
    $scope.imagemFile = null;
    var fileInput = document.getElementById("input-imagem-post");
    if (fileInput) fileInput.value = "";
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

    var fd = new FormData();
    fd.append("title", $scope.novaPublicacao.title);
    fd.append("content", $scope.novaPublicacao.content);
    fd.append("resume", $scope.novaPublicacao.resume);
    fd.append("data_publicacao", $scope.novaPublicacao.data_publicacao);
    if ($scope.imagemFile) {
      fd.append("image", $scope.imagemFile);
    }

    FeedService.postPostMultipart(fd)
      .then(function () {
        $scope.sucesso = "Publicação criada com sucesso!";
        $scope.novaPublicacao = {};
        $scope.imagemPreview = null;
        $scope.imagemFile = null;
        $scope.publicando = false;
        setTimeout(function () {
          $scope.$apply(function () { $location.path("/"); });
        }, 1500);
      }).catch(function (error) {
        console.log("Erro ao criar publicação:", error);
        $scope.erro = "Erro ao criar publicação. Tente novamente.";
        $scope.publicando = false;
      });
  };
});
