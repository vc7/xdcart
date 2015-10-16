(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('CartController_', [
            '$scope', 'CartService',
            function ($scope, CartService) {
                var vm = this;

                $scope.ngCart = $scope.$parent.ngCart;

                // we're not using ngcart-checkout, handle it by CartService
                $scope.checkout = function () {
                    var cart = $scope.ngCart.toObject();

                    // remove appending data
                    angular.forEach(cart.items, function (item, i) {
                        delete item.data;
                    });

                    console.log('checkout');
                    console.log(cart);

                    CartService.checkout(cart).then(function(response) {
                        if (200 === response.status) {
                            console.log('checkout success');
                            console.log('empty cart');
                            $scope.ngCart.empty();
                        } else {
                            console.log('checkout failed');
                        }
                    });
                }
            }
        ]);

})();
