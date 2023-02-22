(function () {
    'use strict';

    angular
        .module('myApp')
        .config(configure);

    configure.$inject = ['$stateProvider'];
    /* @ngInject */
    function configure($stateProvider) {
        $stateProvider.state('site', getState());
    }

    function getState() {
        return {
            url: '/site',
            templateUrl: 'partial/site/site.html',
            controller: 'SiteCtrl',
            controllerAs: 'vm',
            name: 'site'
        };
    }
})();