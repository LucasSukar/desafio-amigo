angular.module("amigoApp").directive("amigoLikeBtn", function () {
  return {
    restrict: "E",
    scope: {
      liked: "=",
      count: "=",
      onClick: "&",
    },
    template: [
      '<button class="feed-card__like-btn" ng-class="{\'feed-card__like-btn--liked\': liked}" ng-click="clicar()">',
      '  <span ng-show="!liked">♡</span>',
      '  <span ng-show="liked">♥</span>',
      '  <span>{{ count }}</span>',
      "</button>",
    ].join(""),
    link: function (scope) {
      scope.clicar = function () {
        scope.onClick();
      };
    },
  };
});
