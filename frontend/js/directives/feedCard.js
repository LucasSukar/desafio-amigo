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
    template: [
      '<div class="feed-card" ng-class="{\'feed-card--menu-open\': post.mostrarOpcoes}">',
      '  <div class="feed-card__header">',
      '    <div class="feed-card__meta" ng-click="clicarPerfil($event)" style="cursor: pointer;">',
      '      <img ng-if="post.user.avatar_url" ng-src="http://localhost:3333/uploads/{{ post.user.avatar_url }}" class="feed-card__avatar" style="object-fit: cover;" />',
      '      <div ng-if="!post.user.avatar_url" class="feed-card__avatar">{{ post.user.name ? post.user.name.charAt(0).toUpperCase() : "?" }}</div>',
      '      <div class="feed-card__author-block">',
      '        <span class="feed-card__author">{{ post.user.name }}</span>',
      '        <span class="feed-card__date">{{ post.data_publicacao | date:"dd MMM, yyyy" }}</span>',
      "      </div>",
      "    </div>",
      '    <div class="feed-card__menu" ng-if="post.allowEdit || post.allowRemove">',
      '      <button class="feed-card__menu-btn" ng-click="toggleOpcoes()">⋮</button>',
      '      <div class="feed-card__menu-panel" ng-show="post.mostrarOpcoes">',
      '        <button class="feed-card__menu-action" ng-if="post.allowEdit" ng-click="editar()">✏️ Editar</button>',
      '        <button class="feed-card__menu-action feed-card__menu-action--danger" ng-if="post.allowRemove" ng-click="deletar()">🗑️ Apagar</button>',
      "      </div>",
      "    </div>",
      "  </div>",
      '  <div class="feed-card__body" ng-click="clicar()">',
      '    <h2 class="feed-card__title">{{ post.title }}</h2>',
      '    <p class="feed-card__resume">{{ post.resume }}</p>',
      "  </div>",
      '  <div class="feed-card__footer">',
      '    <amigo-like-btn liked="post.jaCurtiu" count="post.total_likes" on-click="curtir()"></amigo-like-btn>',
      "  </div>",
      "</div>",
    ].join(""),
    link: function (scope) {
      scope.toggleOpcoes = function () {
        var estadoAtual = scope.post.mostrarOpcoes;
        scope.$root.$broadcast('fecharOpcoes');
        scope.post.mostrarOpcoes = !estadoAtual;
      };

      scope.$on('fecharOpcoes', function() {
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
