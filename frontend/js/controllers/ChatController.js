angular.module("amigoApp").controller("ChatController", function (
  $scope, $routeParams, $location, $interval, $timeout,
  ChatService, LoginService, UsuarioService
) {
  if (!LoginService.obterToken()) {
    $location.path("/");
    return;
  }

  $scope.conversas = [];
  $scope.conversaAtiva = null;
  $scope.mensagens = [];
  $scope.chatData = { novaMensagem: "" };
  $scope.enviando = false;
  $scope.carregando = true;

  var pollingInterval = null;

  // Carrega lista de conversas
  var carregarConversas = function () {
    ChatService.getConversations().then(function (res) {
      $scope.conversas = res.data;
      $scope.carregando = false;

      // Se veio com userId na URL, abre direto
      if ($routeParams.userId && !$scope.conversaAtiva) {
        var found = $scope.conversas.find(function (c) {
          return c.user.id == $routeParams.userId;
        });
        if (found) {
          $scope.abrirConversa(found);
        } else {
          // Usuário ainda sem conversa — busca os dados
          UsuarioService.buscarPorId($routeParams.userId).then(function (r) {
            $scope.abrirConversa({ user: r.data, last_message: null });
          });
        }
      }
    }).catch(function () {
      $scope.carregando = false;
    });
  };

  // Abre uma conversa
  $scope.abrirConversa = function (conv) {
    $scope.conversaAtiva = conv;
    $scope.mensagens = [];
    $scope.chatData.novaMensagem = "";
    carregarMensagens();
    iniciarPolling();
  };

  // Carrega mensagens da conversa ativa
  var carregarMensagens = function () {
    if (!$scope.conversaAtiva) return;
    ChatService.getMessages($scope.conversaAtiva.user.id).then(function (res) {
      $scope.mensagens = res.data;
      rolarParaBaixo();
    });
  };

  // Enviar mensagem
  $scope.enviarMensagem = function () {
    var texto = ($scope.chatData.novaMensagem || "").trim();
    if (!texto || $scope.enviando) return;

    $scope.enviando = true;
    var userId = $scope.conversaAtiva.user.id;

    ChatService.sendMessage(userId, texto).then(function (res) {
      $scope.mensagens.push(res.data);
      $scope.chatData.novaMensagem = "";
      $scope.enviando = false;
      rolarParaBaixo();
      // Atualiza última mensagem na sidebar
      var conv = $scope.conversas.find(function (c) { return c.user.id === userId; });
      if (conv) { conv.last_message = texto; }
      else {
        $scope.conversas.unshift({ user: $scope.conversaAtiva.user, last_message: texto });
      }
    }).catch(function () {
      $scope.enviando = false;
    });
  };

  // Enter para enviar (Shift+Enter = nova linha)
  $scope.enviarComEnter = function ($event) {
    if ($event.keyCode === 13 && !$event.shiftKey) {
      $event.preventDefault();
      $scope.enviarMensagem();
    }
  };

  $scope.voltarParaFeed = function () {
    $location.path("/");
  };

  var rolarParaBaixo = function () {
    $timeout(function () {
      var container = document.getElementById("chat-messages-container");
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  };

  var iniciarPolling = function () {
    if (pollingInterval) $interval.cancel(pollingInterval);
    pollingInterval = $interval(carregarMensagens, 3000);
  };

  $scope.$on("$destroy", function () {
    if (pollingInterval) $interval.cancel(pollingInterval);
  });

  carregarConversas();
});
