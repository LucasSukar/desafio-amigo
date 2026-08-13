angular.module("amigoApp").value("config", {

    baseUrl: (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:3334"
        : ""
})
