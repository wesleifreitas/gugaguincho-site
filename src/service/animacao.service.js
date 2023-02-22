(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('animacaoService', animacaoService);

    animacaoService.$inject = ['$mdToast', '$timeout', '$state', '$rootScope'];

    function animacaoService($mdToast, $timeout, $state, $rootScope) {
        var service = {};

        service.debounce = debounce;
        service.animaScroll = animaScroll;

        return service;

        function debounce(func, wait, immediate) {
            let timeout;
            return function (...args) {
                const context = this;
                const later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }

        /*const target = document.querySelectorAll('[anima-data]');

        //animaScroll();

        if (target.length) {
            window.addEventListener('scroll', debounce(function () {
                animaScroll();
            }, 50));
        }*/

        function animaScroll(target) {
            const windowTop = window.scrollY + ((window.innerHeight * 3) / 4);

            target.forEach(function (el) {
                if (windowTop > el.offsetTop) {
                    el.classList.add('animate');
                } else {
                    el.classList.remove('animate');
                }
            });
        }
    }
})();