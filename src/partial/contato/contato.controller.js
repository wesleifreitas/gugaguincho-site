(function () {
    'use strict';

    angular.module('myApp').controller('ContatoCtrl', ContatoCtrl);

    ContatoCtrl.$inject = ['$mdDialog', 'contatoService'];

    function ContatoCtrl($mdDialog, contatoService) {

        var vm = this;
        vm.init = init;
        vm.sendEmail = sendEmail;

        function init() {

        }

        function sendEmail() {
            contatoService.sendEmail(vm.contato)
                .then(function(response) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Obrigado pelo contato!')
                        .textContent('Retornaremos em breve.')
                        .ariaLabel('Obrigado pelo contato!')
                        .ok('Fechar')
                    );
                });
        }
    }
})();