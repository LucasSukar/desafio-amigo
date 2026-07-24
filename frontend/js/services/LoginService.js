angular.module("amigoApp").factory("LoginService", function($http, config, $window) {
  var _logar = function(credenciais) {
    return $http.post(config.baseUrl + "/sessions", credenciais);
  };

  var _salvarToken = function(token) {
    $window.localStorage.setItem("amigo_token", token);
  };

  var _obterToken = function() {
    return $window.localStorage.getItem("amigo_token");
  };

  return {
    logar: _logar,
    salvarToken: _salvarToken,
    obterToken: _obterToken
  };
});
