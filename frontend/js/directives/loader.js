angular.module("amigoApp").directive("amigoLoader", function () {
  return {
    restrict: "E",
    scope: {
      mensagem: "@",
    },
    templateUrl: "js/directives/view-directives/loader.html",
  };
});
