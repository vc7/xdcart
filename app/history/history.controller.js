(function () {
    'use strict';

    angular
        .module('xdcart')
        .controller('HistoryController', [
            '$scope', 'HistoryService', '$location', '$routeParams',
            function ($scope, HistoryService, $location, $routeParams) {
                var vm = this;

                $scope.id = (undefined === $routeParams.id)? null:$routeParams.id;

                HistoryService.getHistories($routeParams.id).then(function (response) {
                    $scope.histories = response.data;
                });

                $scope.viewHistory = function (transactionId) {
                    $location.url('history/' + transactionId);
                };
            }
        ]);

})();
