angular
  .module("amigoApp")
  .factory("PerfilService", function ($http, config, LoginService) {
    var _getHeaders = function () {
      return {
        headers: { Authorization: "Bearer " + LoginService.obterToken() },
      };
    };

    var _postUser = function (usuario) {
      return $http.post(config.baseUrl + "/users", usuario);
    };

    var _getUserPosts = function () {
      return $http.get(config.baseUrl + "/post/me", _getHeaders());
    };

    var _putPost = function (id, post) {
      return $http.put(config.baseUrl + "/post/" + id, post, _getHeaders());
    };

    var _deletePost = function (id) {
      return $http.delete(config.baseUrl + "/post/" + id, _getHeaders());
    };

    return {
      postUser: _postUser,
      getUserPosts: _getUserPosts,
      putPost: _putPost,
      deletePost: _deletePost,
    };
  });
