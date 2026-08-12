angular.module("amigoApp").factory("ChatService", function ($http, config, LoginService) {
  var _headers = function () {
    return { headers: { Authorization: "Bearer " + LoginService.obterToken() } };
  };

  var _getConversations = function () {
    return $http.get(config.baseUrl + "/messages", _headers());
  };

  var _getMessages = function (userId) {
    return $http.get(config.baseUrl + "/messages/" + userId, _headers());
  };

  var _sendMessage = function (userId, content) {
    return $http.post(config.baseUrl + "/messages/" + userId, { content: content }, _headers());
  };

  return {
    getConversations: _getConversations,
    getMessages: _getMessages,
    sendMessage: _sendMessage,
  };
});
