angular.module("amigoApp").controller("FeedController", function($scope, FeedService){
  $scope.listaPosts = function () {
    FeedService.getPosts().then(function (response) {
      $scope.posts = response.data;

      console.log("Dados da API:", response.data);
    }).catch(function(error) {
        console.log(error)
    })
  }
  $scope.listaPosts();
});
