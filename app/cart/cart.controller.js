(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('CartController_', [
            '$scope', 'CartService', '$location',
            function ($scope, CartService, $location) {
                var vm = this;

                $scope.ngCart = $scope.$parent.ngCart;

                // we're not using ngcart-checkout, handle it by CartService
                $scope.confirm = function () {
                    $location.url('checkout');

                    mixpanel.track("checkout");
                    console.log('mixpanel: begin checkout');
                }
            }
        ]);

})();
