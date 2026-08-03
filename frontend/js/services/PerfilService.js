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

    var _getMe = function () {
      return $http.get(config.baseUrl + "/users/me", _getHeaders());
    };

    var _putPost = function (id, post) {
      return $http.put(config.baseUrl + "/post/" + id, post, _getHeaders());
    };

    var _deletePost = function (id) {
      return $http.delete(config.baseUrl + "/post/" + id, _getHeaders());
    };

    var _putUser = function (usuario) {
      return $http.put(config.baseUrl + "/users", usuario, _getHeaders());
    };

    var _putAvatar = function (fd) {
      return $http.put(config.baseUrl + "/users/avatar", fd, {
        transformRequest: angular.identity,
        headers: {
          "Content-Type": undefined,
          Authorization: "Bearer " + LoginService.obterToken()
        }
      });
    };
    
    return {
      postUser: _postUser,
      putUser: _putUser,
      getMe: _getMe,
      getUserPosts: _getUserPosts,
      putPost: _putPost,
      deletePost: _deletePost,
      putAvatar: _putAvatar,
    };
  });

