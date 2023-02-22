(function () {
    'use strict';

    angular.module('myApp').controller('SiteCtrl', SiteCtrl);

    SiteCtrl.$inject = ['$rootScope', '$scope', '$state', '$mdUtil', '$mdSidenav', '$anchorScroll', '$mdMenu', '$timeout'];
    /* @ngInject */
    function SiteCtrl($rootScope, $scope, $state, $mdUtil, $mdSidenav, $anchorScroll, $mdMenu, $timeout) {
        var vm = this;
        vm.init = init;
        vm.menuClick = menuClick;
        vm.goTo = goTo;
        vm.gotoAnchor = gotoAnchor;
        vm.toggleRight = buildToggler('right');
        // controla a adesão do menu no topo
        vm.nav = null;
        vm.distanciaTopo = null;
        vm.fixo = null;
        vm.botao = null;
        vm.showMenuMobile = showMenuMobile;
        vm.alternar = false;
        vm.exibeSubmenu = false;


        function init() {
            if ($state.current.name === 'cookies') {
                vm.hideMenu = true;
            }

            vm.menus = [{
                name: 'Início',
                state: 'inicio',
            }, {
                name: 'Serviços',
                state: 'inicio',
                anchor: 'produto'
            }, {
                name: 'Regiões',
                state: 'inicio',
                anchor: 'solucoes'
            }/*, {
                name: 'Menu',
                state: false,
                dropdown: [
                    { name: 'Sub1', state: '', anchor: 'sub1' },
                    { name: 'Sub2', state: '', anchor: 'sub2' },
                    { name: 'Sub3', state: '', anchor: 'sub3' }
                ]
            }*//*, {
                name: 'Preços',
                state: 'pricing',
                anchor: ''
                https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_sticky_element
            }*/, {
                name: 'Contato',
                //state: 'contato',
                anchor: 'rodape'

            }];

            $timeout(function () {
                vm.currentState = $state.current.name;
            }, 500);
        }

        var originatorEv;
        vm.openMenu = function ($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };

        $scope.$on('currentStateUpdate', function (event, args) {
            vm.currentState = args.state;
        });

        $scope.noop = function (event) {
            event.stopImmediatePropagation();
        };

        $scope.closeSubMenu = function (event) {
            $mdMenu.hide();
        }

        function gotoAnchor(anchor) {
            $rootScope.$broadcast('gotoAnchorInicio', anchor);
        }

        function menuClick(menu, mdMenu) {
            //console.info('menuClick', menu);
            if (menu.dropdown) {
                mdMenu.open();
                return;
            } else if (!menu.state && !menu.anchor) {
                return;
            } else if (menu.anchor) {
                //console.info('$state', $state);
                let anchor = menu.anchor || menu.codigo;
                //if (!menu.anchor && $state.$current.name !== 'inicio') {
                if ($state.$current.name !== 'inicio') {
                    $state.go('inicio').then(function () {
                        $timeout(() => {
                            $rootScope.$broadcast('gotoAnchorInicio', anchor);
                        }, 500);
                    });
                } else {
                    $rootScope.$broadcast('gotoAnchorInicio', anchor);
                }
            } else {
                $rootScope.$broadcast('gotoAnchorInicio', 'topo');
            }

            if (vm.menuMobile) {
                vm.menuMobile = false;
            }

            mdMenu.close();

            if ($state.current.name !== menu.state) {
                $state.go(menu.state, {}, { reload: false });
            }
            return;
        }

        function goTo(state, closeSidenav) {
            vm.hideMenu = false;
            if (closeSidenav) {
                buildToggler('right', state)();
            } else {
                if (state === 'site') {
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

        function showMenuMobile() {
            vm.menuMobile = !vm.menuMobile;
        }
    }
})();