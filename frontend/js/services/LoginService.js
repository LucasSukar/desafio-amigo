angular.module("amigoApp").factory("LoginService", function($http, config, $window) {
  var _logar = function(credenciais) {
    return $http.post(config.baseUrl + "/sessions", credenciais);
  };

  var _salvarToken = function(token, userId) {
    $window.localStorage.setItem("token", token);
    if (userId) {
      $window.localStorage.setItem("userId", userId);
    }
  };

  var _obterToken = function() {
    return $window.localStorage.getItem("token");
  };

  var _obterUserId = function() {
    return $window.localStorage.getItem("userId");
  };

  var _deslogar = function() {
    $window.localStorage.removeItem("token");
    $window.localStorage.removeItem("userId");
  };

  return {
    logar: _logar,
    salvarToken: _salvarToken,
    obterToken: _obterToken,
    obterUserId: _obterUserId,
    deslogar: _deslogar
  };
});
