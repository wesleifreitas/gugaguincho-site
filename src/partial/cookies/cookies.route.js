(function () {
    'use strict';

    angular
        .module('myApp');

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        $stateProvider.state('teste', getState());
    }

    function getState() {
        return {
            url: '/teste',
            templateUrl: 'partial/site/teste.html',
            //controller: '',
            controllerAs: 'vm',
            name: 'teste'
        };
    }
})();