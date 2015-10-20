(function () {
    'use strict';

    angular
        .module('xdcart', ['ngRoute', 'ngStorage', 'ngCart', 'gavruk.card', 'ui.bootstrap'])
        .constant('apiConfig', {
            mock: {
                mockAPI: true,
                mockDelay: 500
            },
            api: {
                baseUrl: 'http://ngmockup/api',
            }
        })
        .controller('MainController', [
            '$scope', 'UserService', '$sessionStorage', 'ngCart', '$location',
            function ($scope, UserService, $sessionStorage, ngCart, $location) {
                $scope.UserService = UserService;
                $scope.$sessionStorage = $sessionStorage.$default({
                    user: null
                });

                $scope.ngCart =  ngCart;

                // extend ngCart, add checkLoginAddItem function
                ngCart.checkLoginAddItem = function (id, name, price, q, data) {
                    // check if user is logged in, if not then redirect to login page
                    if (!UserService.isLogin) {
                        $sessionStorage.tmpItem = {id: id, name: name, price: price, q: q, data: data};
                        $location.url('login');
                    } else {
                        ngCart.addItem(id, name, price, q, data)
                    }
                }
            }
        ])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/register', {
                    templateUrl: 'app/user/register.view.html',
                    controller: 'UserController',
                    controllerAs: 'vm'
                })
                .when('/login', {
                    templateUrl: 'app/user/login.view.html',
                    controller: 'UserController',
                    controllerAs: 'vm'
                })
                .when('/logout', {
                    templateUrl: 'app/user/logout.view.html',
                    controller: 'UserController',
                    controllerAs: 'vm'
                })
                .when('/products', {
                    templateUrl: 'app/product/product.view.html',
                    controller: 'ProductController',
                    controllerAs: 'vm'
                })
                .when('/cart', {
                    templateUrl:'app/cart/cart.view.html',
                    // ngCart uses CartController and it will cause broadcast called twice if set to same name
                    controller: 'CartController_',
                    controllerAs: 'vm'
                })
                .when('/checkout', {
                    templateUrl:'app/checkout/checkout.view.html',
                    controller: 'CheckoutController',
                    controllerAs: 'vm'
                })
                .when('/history', {
                    templateUrl:'app/history/history.view.html',
                    controller: 'HistoryController',
                    controllerAs: 'vm'
                })
                .when('/history/:id', {
                    templateUrl:'app/history/history.view.html',
                    controller: 'HistoryController',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/login'
                });
        })
        .run([
            '$rootScope', '$location', '$sessionStorage', 'UserService',
            function ($rootScope, $location, $sessionStorage, UserService) {

                UserService.isLogin = (function () {
                    // check if user is set and session not expired
                    // one may use simple http request to ensure session is valid
                    if (null !== $sessionStorage.user && Math.floor(Date.now() / 1000) < $sessionStorage.expire) {
                        return true;
                    }
                    return false;
                })();

                // you can also use ng-route's resolve to handle it
                $rootScope.$on('$routeChangeStart', function (event) {
                    var current = $location.path().split('/')[1];

                    var guestCanView = ['register', 'login', 'products'];
                    if (!UserService.isLogin && guestCanView.indexOf(current) < 0) {
                        $location.url('products');
                    }
                });
            }
        ]);
})();
