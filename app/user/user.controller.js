(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('UserController', [
            '$scope', '$location', 'ngCart',
            function ($scope, $location, ngCart) {
                var vm = this;
                var UserService = $scope.$parent.UserService;
                var $sessionStorage = $scope.$parent.$sessionStorage;

                if (null !== $sessionStorage.user) {
                    $location.url('products');
                }

                $scope.login = function () {
                    UserService.login(vm).then(function (response) {
                        if (200 === response.status) {
                            console.log('login success');
                            // very basic implementation
                            $sessionStorage.user = vm.username;
                            $location.url('products');
                        } else {
                            console.log('login failed');
                            $scope.error = response.data;
                        }
                    });
                };

                $scope.logout = function () {
                    UserService.logout().then(function (response) {
                        if (200 === response.status) {
                            console.log('logout success');
                            $sessionStorage.user = null;
                            console.log('empty cart');
                            ngCart.empty();
                            $location.url('login');
                        } else {
                            console.log('something wrong');
                        }
                    });
                };

                $scope.register = function () {
                    UserService.register(vm).then(function (response) {
                        if (200 === response.status) {
                            console.log('register success');
                            $location.url('login');
                        } else {
                            console.log('register failed');
                            $scope.error = response.data;
                        }
                    });
                };
            }
        ]);

})();
