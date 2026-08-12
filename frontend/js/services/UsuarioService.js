angular.module("amigoApp").factory("UsuarioService", function ($http, config, LoginService) {
  var _getHeaders = function () {
    return { headers: { Authorization: "Bearer " + LoginService.obterToken() } };
  };

  var _listarTodos = function () {
    return $http.get(config.baseUrl + "/users", _getHeaders());
  };

  var _toggleFollow = function (userId) {
    return $http.post(config.baseUrl + "/users/" + userId + "/follow", {}, _getHeaders());
  };

  var _listarSeguindo = function () {
    return $http.get(config.baseUrl + "/users/following", _getHeaders());
  };

  var _getById = function (userId) {
    return $http.get(config.baseUrl + "/users/" + userId, _getHeaders());
  };

  // Alias para ChatController (mesmo endpoint)
  var _buscarPorId = _getById;

  var _getPostsByUser = function (userId) {
    return $http.get(config.baseUrl + "/post/user/" + userId, _getHeaders());
  };

  var _deleteAccount = function () {
    return $http.delete(config.baseUrl + "/users/me", _getHeaders());
  };

  return {
    listarTodos: _listarTodos,
    toggleFollow: _toggleFollow,
    listarSeguindo: _listarSeguindo,
    getById: _getById,
    buscarPorId: _buscarPorId,
    getPostsByUser: _getPostsByUser,
    deleteAccount: _deleteAccount,
  };
});
