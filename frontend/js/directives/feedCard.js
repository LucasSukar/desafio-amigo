angular.module("amigoApp").directive("amigoFeedCard", function () {
  return {
    restrict: "E",
    scope: {
      post: "=",
      onLike: "&",
      onEdit: "&",
      onDelete: "&",
      onClick: "&",
      onClickProfile: "&",
    },
    templateUrl: "js/directives/view-directives/feed-card.html",
    link: function (scope) {
      scope.toggleOpcoes = function () {
        var estadoAtual = scope.post.mostrarOpcoes;
        scope.$root.$broadcast('fecharOpcoes');
        scope.post.mostrarOpcoes = !estadoAtual;
      };

      scope.$on('fecharOpcoes', function () {
        if (scope.post) scope.post.mostrarOpcoes = false;
      });

      scope.curtir = function () {
        scope.onLike({ post: scope.post });
      };

      scope.editar = function () {
        scope.post.mostrarOpcoes = false;
        scope.onEdit({ post: scope.post });
      };

      scope.deletar = function () {
        scope.post.mostrarOpcoes = false;
        scope.onDelete({ id: scope.post.id });
      };

      scope.clicar = function () {
        scope.onClick({ id: scope.post.id });
      };

      scope.clicarPerfil = function ($event) {
        $event.stopPropagation();
        scope.onClickProfile({ id: scope.post.user_id || scope.post.user.id });
      };
    },
  };
});
