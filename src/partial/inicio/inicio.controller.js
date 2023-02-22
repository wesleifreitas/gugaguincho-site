(function () {
    'use strict';

    angular.module('myApp').controller('InicioCtrl', InicioCtrl);

    InicioCtrl.$inject = ['$rootScope', '$scope', '$state', '$mdUtil', '$mdSidenav', '$anchorScroll', '$location', '$timeout', 'anchorSmoothScroll', '$mdToast', 'animacaoService'];
    /* @ngInject */
    function InicioCtrl($rootScope, $scope, $state, $mdUtil, $mdSidenav, $anchorScroll, $location, $timeout, anchorSmoothScroll, $mdToast, animacaoService) {
        var vm = this;
        vm.init = init;
        vm.goTo = goTo;
        vm.toggleRight = buildToggler('right');
        vm.gotoAnchor = gotoAnchor;
        vm.cookies = cookies;
        vm.whatsapp = whatsapp;

        vm.notif = true;

        $scope.$on('gotoAnchorInicio', function (event, args) {
            //console.info('gotoAnchorBemVindo');
            $timeout(() => {
                gotoAnchor(args);

            });
        });

        function init() {
            let arrayHash = window.location.hash.split('#')
            if (arrayHash.length > 2) {
                $timeout(() => {
                    vm.gotoAnchor(arrayHash[arrayHash.length - 1]);
                });
            }

            const target = document.querySelectorAll('[anima-data]');

            if (target.length) {
                window.addEventListener('scroll', animacaoService.debounce(() => {
                    animacaoService.animaScroll(target);
                }, 50));
            }
        }

        $scope.$on('currentStateUpdate', function (event, args) {
            vm.currentState = args.state;
        });

        function goTo(state, closeSidenav) {
            if (closeSidenav) {
                buildToggler('right', state)();
            } else {
                if (state === 'inicio') {
                    vm.currentNavItem = '';
                }

                vm.currentState = state;
                $state.go(state);
            }
        }

        function buildToggler(navID, state) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        if (state) {
                            goTo(state);
                        }
                        //$log.debug("toggle " + navID + " is done");                        
                    });
            }, 300);
            return debounceFn;
        }

        function gotoAnchor(section) {
            //console.info('gotoAnchor', section);

            anchorSmoothScroll.scrollTo(section);
            $rootScope.$broadcast('fechaMenu', {});
            return;
            //section = 'anchor' + section;

            // compensar md-toolbar-tools
            $anchorScroll.yOffset = 80;

            var newHash = section;
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(section);
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        }

        function whatsapp() {
            let url = 'https://api.whatsapp.com/send?phone=5511974417607&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20guincho.'
            window.open(url, '_blank');
        }

        function cookies() {
            //alert();
            //$state.go('cookies');
            let url = $state.href('cookies', {});
            window.open(url, '_blank');
        }
    }
})();