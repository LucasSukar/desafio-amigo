angular.module("amigoApp").factory("FeedService", function($http, config){
  var _getPosts = function() {
    return $http.get(config.baseUrl + "/post");
  }
  var _getPost = function() {
    return $http.get(config.baseUrl + "/post/" + id);
  }
  return{
    getPosts: _getPosts,
    getPost: _getPost,
  }
})
