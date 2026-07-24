angular.module("amigoApp").factory("PerfilService", function($http, config){
  var _postUser = function(usuario) {
    return $http.post(config.baseUrl + "/users", usuario);
  }

  return{
    postUser: _postUser
  }
})
