angular.module("amigoApp").factory("FeedService", function ($http, config, LoginService) {
  var _getHeaders = function () {
    var token = LoginService.obterToken();
    if (!token) return {};
    return {
      headers: { Authorization: "Bearer " + token },
    };
  };

  var _getPosts = function (page) {
    return $http.get(config.baseUrl + "/post?page=" + (page || 1), _getHeaders());
  };

  var _getPost = function (id) {
    return $http.get(config.baseUrl + "/post/" + id);
  };

  var _getUserPost = function () {
    return $http.get(config.baseUrl + "/post/me", _getHeaders());
  };

  var _postPost = function (post) {
    return $http.post(config.baseUrl + "/post", post, _getHeaders());
  };

  var _putPost = function (id, post) {
    return $http.put(config.baseUrl + "/post/" + id, post, _getHeaders());
  };

  var _deletePost = function (id) {
    return $http.delete(config.baseUrl + "/post/" + id, _getHeaders());
  };

  var _postLike = function (idDoPost) {
    return $http.post(config.baseUrl + "/post/" + idDoPost + "/like", {},  _getHeaders());
  };

  return {
    postLike: _postLike,
    getPosts: _getPosts,
    getPost: _getPost,
    getUserPost: _getUserPost,
    postPost: _postPost,
    putPost: _putPost,
    deletePost: _deletePost,
  };
});
