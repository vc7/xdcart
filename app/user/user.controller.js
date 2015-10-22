(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('UserController', [
            '$scope', '$location', 'ngCart', 'Mixpanel',
            function ($scope, $location, ngCart, Mixpanel) {
                var vm = this;
                var UserService = $scope.$parent.UserService;
                var $sessionStorage = $scope.$parent.$sessionStorage;

                if (UserService.isLogin) {
                    $location.url('products');
                }

                $scope.login = function () {
                    UserService.login(vm).then(function (response) {
                        if (200 === response.status) {
                            console.log('login success');

                            Mixpanel.trackLogin('1', { "$first_name": response.data.user });
                            
                            // very basic implementation
                            $sessionStorage.user = response.data.user;
                            $sessionStorage.expire = response.data.expire;
                            UserService.isLogin = true;

                            if (undefined !== $sessionStorage.tmpItem) {
                                var t = $sessionStorage.tmpItem;
                                ngCart.addItem(t.id, t.name, t.price, t.q, t.data);
                                delete $sessionStorage.tmpItem;
                            }

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

                            Mixpanel.trackLogout();

                            $sessionStorage.user = null;
                            delete $sessionStorage.expire;
                            UserService.isLogin = false;
                            console.log('empty cart');
                            ngCart.empty();
                            $location.url('products');
                        } else {
                            console.log('something wrong');
                        }
                    });
                };

                $scope.register = function () {
                    UserService.register(vm).then(function (response) {
                        if (200 === response.status) {
                            console.log('register success');

                            Mixpanel.trackRegister();
                            
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
