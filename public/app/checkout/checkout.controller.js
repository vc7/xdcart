(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('CheckoutController', [
            '$scope', 'CartService', '$modal', '$location',
            function ($scope, CartService, $modal, $location) {
                var vm = this;

                $scope.ngCart = $scope.$parent.ngCart;
                $scope.card = {};

                $scope.back = function () {
                    $location.url('cart');
                };

                $scope.pay = function () {
                    $scope.payModal = $modal.open({
                        templateUrl: 'app/checkout/pay.modal.view.html',
                        scope: $scope,
                        backdrop: 'static',
                        keyboard: false
                    });
                };

                $scope.cancel = function() {
                    $scope.payModal.dismiss('cancel');
                    $scope.card = {};
                };

                // we're not using ngcart-checkout, handle it by CartService
                $scope.checkout = function () {
                    var card = $scope.card;
                    var cart = $scope.ngCart.toObject();

                    // remove appending data
                    angular.forEach(cart.items, function (item, i) {
                        delete item.data;
                    });

                    console.log('checkout');
                    console.log(card);
                    console.log(cart);

                    CartService.checkout({card: card, cart: cart}).then(function(response) {
                        if (200 === response.status) {
                            console.log('checkout success');
                            console.log('empty cart');
                            $scope.ngCart.empty();
                            console.log('close modal');
                            $scope.payModal.close();
                            $scope.card = {};
                            $location.url('history/' + response.data.transactionId);
                        } else {
                            console.log('checkout failed');
                            $scope.payModal.dismiss('error');
                            $scope.error = response.data;
                        }
                    });
                }
            }
        ]);

})();
