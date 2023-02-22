(function () {
    'use strict';

    const PROJECT_NAME = 'myApp';

    angular
        .module(PROJECT_NAME, [
            'ui.router',
            'ui.router.state.events',
            'ngCookies',
            'ngMaterial',
            //'ngMessages',
            //'angular-loading-bar',
            //'ui.utils.masks'
        ])
        .config(config)
        .run(['$transitions', function ($transitions) {
            $transitions.onSuccess({}, function () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });
        }])
        .run(run);


    // Serviço de efeito de rolagem
    angular.module(PROJECT_NAME)
        .service('anchorSmoothScroll', function () {

            this.scrollTo = function (eID) {

                // This scrolling function 
                // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

                var startY = currentYPosition();
                var stopY = elmYPosition(eID) - 80;
                var distance = stopY > startY ? stopY - startY : startY - stopY;
                if (distance < 100) {
                    scrollTo(0, stopY);
                    return;
                }
                var speed = Math.round(distance / 10);
                if (speed >= 20) {
                    speed = 20
                };
                //speed = 1;

                var step = Math.round(distance / 25);
                //step = 1;

                var leapY = stopY > startY ? startY + step : startY - step;
                var timer = 0;
                if (stopY > startY) {
                    for (var i = startY; i < stopY; i += step) {
                        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                        leapY += step;
                        if (leapY > stopY) leapY = stopY;
                        timer++;
                    }
                    return;
                }
                for (var i = startY; i > stopY; i -= step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY -= step;
                    if (leapY < stopY) leapY = stopY;
                    timer++;
                }

                function currentYPosition() {
                    // Firefox, Chrome, Opera, Safari
                    if (self.pageYOffset) return self.pageYOffset;
                    // Internet Explorer 6 - standards mode
                    if (document.documentElement && document.documentElement.scrollTop)
                        return document.documentElement.scrollTop;
                    // Internet Explorer 6, 7 and 8
                    if (document.body.scrollTop) return document.body.scrollTop;
                    return 0;
                }

                function elmYPosition(eID) {
                    var elm = document.getElementById(eID);

                    if (elm) {
                        var y = elm.offsetTop;
                        var node = elm;
                        while (node.offsetParent && node.offsetParent != document.body) {
                            node = node.offsetParent;
                            y += node.offsetTop;
                        }
                        return y;
                    }
                }

            };
        });

    angular
        .module(PROJECT_NAME)
        .factory('httpRequestInterceptor', ['$q', 'config', function ($q, config) {
            return {
                request: async (requestConfig) => {
                    if (String(requestConfig.url).indexOf('guga-guincho') > -1 || String(requestConfig.url).indexOf('cadastro') > -1) {
                        requestConfig.headers['version'] = config.PROJECT_VERSION;
                    }

                    //console.info('requestConfig.url', requestConfig.url);
                    if (requestConfig.url.indexOf('partial/') > -1) {
                        // Adicionar o parâmetro v (versão) na url da requisição
                        if (requestConfig.url.indexOf('?') === -1) {
                            requestConfig.url += '?v=' + config.PROJECT_VERSION;
                        } else {
                            requestConfig.url += '&v=' + config.PROJECT_VERSION;
                        }
                    }

                    return requestConfig || $q.when(requestConfig);
                }
            };
        }]);

    var localUrl = 'http://localhost:8500';
    if (window.location.hostname !== 'localhost' && window.location.hostname !== 'http://127.0.0.1') {
        localUrl = window.location.origin;
    }

    // RESTful - Node.js
    // Registrar REST:
    // $ cd backend/node
    // $ node server.js

    // RESTful - ColdFusion
    // Registrar REST: http://localhost:8500/app/backend/cf/rest-init.cfm
    angular.module(PROJECT_NAME).constant('config', {
        PROJECT_ID: 0,
        PROJECT_VERSION: '1.0.1',
        //'REST_URL': localUrl + '/rest/app',
        'REST_URL': 'https://guga-guincho.com.br/rest/guga-guincho',
    });

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdDateLocaleProvider',
        /*'cfpLoadingBarProvider',*/ '$httpProvider', '$mdGestureProvider'
    ];

    function config($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdDateLocaleProvider,
        /*cfpLoadingBarProvider,*/ $httpProvider, $mdGestureProvider) {

        //https://github.com/angular/material/issues/10699
        $mdGestureProvider.skipClickHijack();

        $httpProvider.interceptors.push('httpRequestInterceptor');

        //cfpLoadingBarProvider.includeSpinner = false;

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('inicio');
        });

        // #FFC107
        $mdThemingProvider.definePalette('primaryPalette', {
            '50': 'fff8e1',
            '100': 'ffecb5',
            '200': 'ffe083',
            '300': 'ffd451',
            '400': 'ffca2c',
            '500': 'ffc107',
            '600': 'ffbb06',
            '700': 'ffb305',
            '800': 'ffab04',
            '900': 'ff9e02',
            'A100': 'ffffff',
            'A200': 'fffaf2',
            'A400': 'ffe4bf',
            'A700': 'ffd9a6',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                'A100',
                'A200',
                'A400',
                'A700'
            ],
            'contrastLightColors': []
        });

        // #DC143C crimson
        $mdThemingProvider.definePalette('accentPalette', {
            '50': 'fbe3e8',
            '100': 'f5b9c5',
            '200': 'ee8a9e',
            '300': 'e75b77',
            '400': 'e13759',
            '500': 'dc143c',
            '600': 'd81236',
            '700': 'd30e2e',
            '800': 'ce0b27',
            '900': 'c5061a',
            'A100': 'ffeeef',
            'A200': 'FF8890',
            'A400': 'FF6F78',
            'A700': 'DC143C',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                '300',
                'A100',
                'A200',
                'A400',
                'A700'
            ],
            'contrastLightColors': [
                '400',
                '500',
                '600',
                '700',
                '800',
                '900'
            ]
        });

        $mdThemingProvider.theme('default')
            // FFC107
            .primaryPalette('primaryPalette')
            .accentPalette('accentPalette');

        //moment.locale('pt-BR');

        // https://material.angularjs.org/latest/api/service/$mdDateLocaleProvider
        $mdDateLocaleProvider.months = ['janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro'
        ];
        $mdDateLocaleProvider.shortMonths = ['jan.',
            'fev',
            'mar',
            'abr',
            'maio',
            'jun',
            'jul',
            'ago',
            'set',
            'out',
            'nov',
            'dez'
        ];
        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'L', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };

        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment(date).format('L') : '';
        };

        $stateProvider
            // bem vindo
            .state('inicio', {
                url: '/inicio',
                templateUrl: 'partial/inicio/inicio.html',
                controller: 'InicioCtrl',
                controllerAs: 'vm',
                parent: 'site',
                name: 'inicio'
            })
            // contato
            .state('contato', {
                url: '/contato',
                templateUrl: 'partial/contato/contato.html',
                controller: 'ContatoCtrl',
                controllerAs: 'vm',
                parent: 'site',
                name: 'contato'
            })
            // cookies
            .state('cookies', {
                url: '/inicio/cookies',
                templateUrl: 'partial/cookies/cookies.html',
                controller: 'CookiesCtrl',
                controllerAs: 'vm',
                parent: 'site',
                name: 'cookies',
            })
            // 404
            .state('404', {
                url: '/inicio/404',
                templateUrl: 'partial/404/404.html',
                controller: 'PageNotFound',
                controllerAs: 'vm',
                parent: 'site',
                name: 'nao-encontrado',
            });

    }

    quemSomosEnter.$inject = ['$state', '$timeout', '$location', 'anchorSmoothScroll'];

    function quemSomosEnter($state, $timeout, $location, anchorSmoothScroll) {
        $timeout(function () {
            if ($state.current.name !== '') {
                //$location.hash('quem-somos');
                anchorSmoothScroll.scrollTo('quem-somos');
            }
        });
    }

    run.$inject = ['$rootScope', '$state'];

    function run($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            $rootScope.$broadcast('fechaMenu', {});
        });
    }
})();