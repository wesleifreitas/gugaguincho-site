(function () {
    'use strict';

    angular.module('myApp').controller('CookiesCtrl', CookiesCtrl);

    CookiesCtrl.$inject = [];

    function CookiesCtrl() {

        var vm = this;
        vm.init = init;

        function init() {

        }
    }
})();