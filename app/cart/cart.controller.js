(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('CartController_', [
            '$scope', 'CartService', '$location', 'Mixpanel',
            function ($scope, CartService, $location, Mixpanel) {
                var vm = this;

                $scope.ngCart = $scope.$parent.ngCart;

                // we're not using ngcart-checkout, handle it by CartService
                $scope.confirm = function () {
                    
                    Mixpanel.trackCheckout();

                    $location.url('checkout');
                }
            }
        ]);

})();
