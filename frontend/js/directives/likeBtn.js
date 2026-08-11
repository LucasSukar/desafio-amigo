angular.module("amigoApp").directive("amigoLikeBtn", function () {
  return {
    restrict: "E",
    scope: {
      liked: "=",
      count: "=",
      onClick: "&",
    },
    templateUrl: "js/directives/view-directives/like-btn.html",
    link: function (scope) {
      scope.clicar = function () {
        scope.onClick();
      };
    },
  };
});
