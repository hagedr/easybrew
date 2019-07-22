export default angular.module('service', [])
    .service('shell', ['$scope', function ($scope) {
        return {
            shellTableResult: function (result) {
                return '--';
            }
        }
    }]).name;