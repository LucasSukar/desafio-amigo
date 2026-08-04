angular.module("amigoApp").factory("FeedService", function ($http, config, LoginService) {
  var _getHeaders = function () {
    var token = LoginService.obterToken();
    if (!token) return {};
    return {
      headers: { Authorization: "Bearer " + token },
    };
  };

  var _getLikedKey = function() {
    var token = LoginService.obterToken();
    if (!token) return "liked_posts_anonymous";
    return "liked_posts_" + token.substring(0, 16);
  };

  var _getLikedPosts = function() {
    return JSON.parse(localStorage.getItem(_getLikedKey()) || "{}");
  };

  var _saveLikedPosts = function(likedPosts) {
    localStorage.setItem(_getLikedKey(), JSON.stringify(likedPosts));
  };

  var _getPosts = function (page) {
    return $http.get(config.baseUrl + "/post?page=" + (page || 1), _getHeaders());
  };

  var _getPost = function (id) {
    return $http.get(config.baseUrl + "/post/" + id, _getHeaders());
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
    return $http.post(config.baseUrl + "/post/" + idDoPost + "/like", {}, _getHeaders());
  };

  var _toggleLike = function (post) {
    return _postLike(post.id).then(function () {
      var likedPosts = _getLikedPosts();
      if (post.jaCurtiu) {
        if (post.total_likes > 0) post.total_likes = post.total_likes - 1;
        post.jaCurtiu = false;
        delete likedPosts[post.id];
      } else {
        post.total_likes = post.total_likes + 1;
        post.jaCurtiu = true;
        likedPosts[post.id] = true;
      }
      _saveLikedPosts(likedPosts);
    });
  };

  var _aplicarCurtidas = function(posts) {
    var likedPosts = _getLikedPosts();
    var isAuthenticated = !!LoginService.obterToken();
    for (var i = 0; i < posts.length; i++) {
      if (isAuthenticated) {
        if (posts[i].jaCurtiu) {
          likedPosts[posts[i].id] = true;
        } else {
          delete likedPosts[posts[i].id];
        }
      } else {
        posts[i].jaCurtiu = !!likedPosts[posts[i].id];
      }
    }
    _saveLikedPosts(likedPosts);
    return posts;
  };

  return {
    toggleLike: _toggleLike,
    postLike: _postLike,
    getPosts: _getPosts,
    getPost: _getPost,
    getUserPost: _getUserPost,
    postPost: _postPost,
    putPost: _putPost,
    deletePost: _deletePost,
    getLikedPosts: _getLikedPosts,
    aplicarCurtidas: _aplicarCurtidas,
  };
});
