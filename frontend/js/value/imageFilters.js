
angular.module("amigoApp").filter("avatarUrl", ["config", function(config) {
    return function(value) {
        if (!value) return "";
        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }
        
        return config.baseUrl + "/uploads/" + value;
    };
}]);


angular.module("amigoApp").filter("postImageUrl", ["config", function(config) {
    return function(value) {
        if (!value) return "";
        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }
        return config.baseUrl + "/uploads/" + value;
    };
}]);
