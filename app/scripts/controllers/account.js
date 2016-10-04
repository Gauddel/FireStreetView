'use strict';


angular.module('jujuvu2App')
  .controller('AccountCtrl', function ($scope, user, Auth, $timeout, $log, $location, streetViewService) {
    $scope.user = user;
    $scope.logout = function() { Auth.$unauth(); };   
    $scope.views = [];

    var profile = streetViewService.getProfileById(user.uid);
    profile.$bindTo($scope, 'profile');

    $scope.validation = function() { 
     if(profile.validated === 'false')
     {
        $log.debug('User account has not yet been validated');
        //$location.path('/accountvalidation');
     }
     else
     {
       $log.debug('User account validated');
     }
    };

    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        Auth.$changePassword({email: profile.email, oldPassword: oldPass, newPassword: newPass})
          .then(function() {
            success('Password changed');
          }, error);
      }
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: profile.email})
        .then(function() {
          profile.email = newEmail;
          profile.$save();
          success('Email changed');
        })
        .catch(error);
    };

    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.views.unshift(obj);
      $timeout(function() {
        $scope.views.splice($scope.views.indexOf(obj), 1);
      }, 10000);
    }

  });
