(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('ProductController', [
            '$scope', 'ProductService',
            function ($scope, ProductService) {
                var vm = this;

                ProductService.getProducts().then(function (response) {
                    $scope.products = response.data;
                });
            }
        ]);

})();
