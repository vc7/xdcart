(function () {
    'use strict';

    angular
        .module('xdcart')
        .factory('CartService', ['$http', 'apiConfig', function ($http, apiConfig) {
            var service = {
                'checkout': function (data) {
                    console.log('getCarts');
                    return $http.post(apiConfig.api.baseUrl + '/checkout', data).then(success, error);
                }
            };

            var success = function (data) {
                console.log('CartService: success');
                return data;
            }

            var error = function (data) {
                console.log('CartService: error');
                return data;
            }

            return service;
        }])

        .factory('HistoryService', ['$http', 'apiConfig', function ($http, apiConfig) {
            var service = {
                'getHistories': function (id) {
                    console.log('getHistories');
                    console.log(id);
                    if (undefined !== id) {
                        return $http.get(apiConfig.api.baseUrl + '/histories/' + id).then(success, error);
                    } else {
                        return $http.get(apiConfig.api.baseUrl + '/histories').then(success, error);
                    }
                }
            };

            var success = function (data) {
                console.log('HistoryService: success');
                return data;
            }

            var error = function (data) {
                console.log('HistoryService: error');
                return data;
            }

            return service;
        }])

        .factory('ProductService', ['$http', 'apiConfig', function ($http, apiConfig) {
            var service = {
                'getProducts': function () {
                    console.log('getProducts');
                    return $http.get(apiConfig.api.baseUrl + '/products').then(success, error);
                }
            };

            var success = function (data) {
                console.log('ProductService: success');
                return data;
            }

            var error = function (data) {
                console.log('ProductService: error');
                return data;
            }

            return service;
        }])

        .factory('UserService', ['$http', 'apiConfig', function ($http, apiConfig) {
            var service = {
                'register': function (data) {
                    console.log('register');
                    console.log(data);
                    return $http.post(apiConfig.api.baseUrl + '/register', data).then(success, error);
                },
                'login': function (data) {
                    console.log('login');
                    console.log(data);
                    return $http.post(apiConfig.api.baseUrl + '/login', data).then(success, error);
                },
                'logout': function () {
                    console.log('logout');
                    return $http.get(apiConfig.api.baseUrl + '/logout').then(success, error);
                }
            };

            var success = function (data) {
                console.log('UserService: success');
                return data;
            };

            var error = function (data) {
                console.log('UserService: error');
                return data;
            };

            return service;
        }]);

})();
