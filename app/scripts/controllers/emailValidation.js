'use strict';


angular.module('jujuvu2App')
.controller('emailVerifyController', ['$scope', '$stateParams', 'currentAuth',
  function($scope, $stateParams, currentAuth) {
  /*  console.log(currentAuth);
    $scope.doVerify = function() {
      firebase.auth()
        .applyActionCode($stateParams.oobCode)
        .then(function(data) {
          toastr.success('Verification happened', 'Success!');
        })
        .catch(function(error) {
          $scope.error = error.message;
          toastr.error(error.message, error.reason, { timeOut: 0 });
        })
    };*/
  }
]);
