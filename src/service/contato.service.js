(function() {
    'use strict';

    angular
        .module('myApp')
        .factory('contatoService', contatoService);

    contatoService.$inject = ['config', '$http', '$q', '$timeout'];

    function contatoService(config, $http, $q, $timeout) {
        var service = {};

        service.sendEmail = sendEmail;

        return service;

        function sendEmail(data) {

            var req = $http({
                    url: config.REST_URL + '/contato/',
                    method: 'POST',
                    headers: {
                        'Authorization': '',
                        'Content-Type': 'application/json'
                    },
                    data: data
                })
                .then(handleSuccess, handleError);

            return req;
        }

        // private functions

        function handleSuccess(response) {
            //console.info('handleSuccess', response);
            /*if (response.data.message && response.data.message !== '') {
                toastService.message(response);
            }*/

            return response.data;
        }

        function handleError(response) {
            console.info('handleError', response);
            /*if (!angular.isObject(response.data) || !response.data.Message) {
                response.data.Message = 'Ops! Ocorreu um erro desconhecido';
            }

            toastService.message(response, { hideDelay: 2000 });*/

            return ($q.reject(response.data.Message));
        }
    }

})();