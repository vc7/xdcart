// use angular-mocks to mockup http api
// refer: http://plnkr.co/edit/eXycLiNmlVKjaZXf0kCH
(function () {
    'use strict';

    angular
        .module('xdcart')
        .config(function (apiConfig, $provide) {
            if (apiConfig.mock.mockAPI) {
                $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
            }
        })
        .config(function (apiConfig, $httpProvider) {
            // if mockup is not enabled, skip it
            if (!apiConfig.mock.mockAPI) {
                return;
            }

            // hook on request and response
            $httpProvider.interceptors.push(function ($q, $timeout, apiConfig) {
                return {
                    request: function (config) {
                        return config;
                    },
                    response: function (response) {
                        // pass all views
                        if (!response.config.url.match(/ngmock/g)) {
                            return response;
                        }

                        // mock delay
                        var deferred = $q.defer();

                        console.log('mock delay = ' + apiConfig.mock.mockDelay);
                        $timeout(function () {
                            deferred.resolve(response);
                        }, apiConfig.mock.mockDelay);

                        return deferred.promise;
                    }
                }
            });
        })
        .run(function (apiConfig, $httpBackend, $http, $q, $sessionStorage) {
            // if mockup is not enabled, skip it
            if (!apiConfig.mock.mockAPI) {
                return;
            }

            // check if request url contains 'ngmock'
            var isMockUrl = function (string) {
                return string.match(/ngmock/g);
            };

            var isOtherUrl = function (string) {
                return !string.match(/ngmock/g);
            };

            // pass all views and other requests
            $httpBackend.whenGET(isOtherUrl).passThrough();

            // get mock data in parallel
            // it's magic!!
            var getData = function () {
                console.log('load mock data');
                var result = {};

                var getData = function (url) {
                    var deferred = $q.defer();
                    $http.get(url).then(function (response) {
                        deferred.resolve(response.data);
                    });
                    return deferred.promise;
                };

                return $q.all({
                    users: getData('app/mockdata/users.json'),
                    products: getData('app/mockdata/products.json')
                });
            };

            // after mock data is loaded, handles mocked requests
            getData().then(function (mockData) {
                // mockup GET
                $httpBackend.whenGET(isMockUrl).respond(
                    function (method, url, data, headers) {
                        console.log('mock get');

                        var controller = url.split('/').slice(-1)[0];
                        var id = null;

                        if (parseInt(controller) == controller) {
                            controller = url.split('/').slice(-2)[0];
                            id = url.split('/').slice(-2)[1];
                        }

                        var result = [400, 'bad request', {}];

                        switch (controller) {
                        case 'histories':
                            var user = $sessionStorage.user;
                            if (null !== id) {
                                result = [200, [$sessionStorage.history[user][id-1]], {}];
                            } else {
                                result = [200, $sessionStorage.history[user], {}];
                            }
                            break;
                        case 'products':
                            result = [200, mockData.products, {}];
                            break;
                        case 'logout':
                            result = [200, 'logout success', {}];
                            break;
                        default:
                            result = [400, 'controller mock for [get::' + controller + '] not found', {}];
                            break;
                        }

                        console.log(result);
                        return result;
                    }
                );

                // mockup POST
                $httpBackend.whenPOST(isMockUrl).respond(
                    function (method, url, data, headers) {
                        console.log('mock post');

                        var controller = url.split('/').slice(-1)[0];
                        var postData = angular.fromJson(data);
                        var result = [400, 'bad request', {}];

                        switch (controller) {
                        case 'login':
                            var passed = false;
                            result = [400, 'auth failed', {}];
                            angular.forEach(mockData.users, function (user, i) {
                                if (
                                    !passed
                                    && postData.username === user.username
                                    && postData.password === user.password
                                ) {
                                    result = [200, 'auth passed', {}];
                                    passed = true;
                                }
                            });
                            if (200 === result[0]) {
                                // mock history storage
                                $sessionStorage.$default({
                                    history: {}
                                });
                                // initialize user history if not exist
                                if (undefined === $sessionStorage.history[postData.username]) {
                                    $sessionStorage.history[postData.username] = [];
                                }
                            }
                            break;
                        case 'checkout':
                            var user = $sessionStorage.user;
                            // add fake transaction id, timestamp and image
                            postData.cart.transactionId = $sessionStorage.history[user].length + 1;
                            postData.cart.timestamp = Math.floor(Date.now() / 1000);
                            angular.forEach(postData.cart.items, function (item) {
                                item.image = 'images/placeholder.jpg';
                            });
                            $sessionStorage.history[user].push(postData.cart);
                            console.log($sessionStorage.history[user]);
                            result = [200, postData.cart, {}];
                            break;
                        case 'register':
                            var duplicated = false;
                            angular.forEach(mockData.users, function (user, i) {
                                if (postData.username === user.username) {
                                    result = [409, 'user exists', {}];
                                    duplicated = true;
                                }
                            });
                            if (!duplicated) {
                                mockData.users.push(postData);
                                result = [200, 'success', {}];
                            }
                            break;
                        default:
                            result = [400, 'controller mock for [post::' + controller + '] not found', {}];
                            break;
                        }

                        console.log(result);
                        return result;
                    }
                );
            });
        });

})();
