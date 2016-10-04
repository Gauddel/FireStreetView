'use strict';

angular.module('jujuvu2App')
  .controller('AddStreetViewCtrl',	['$location','$log', '$routeParams','$timeout', '$firebaseArray', 'Ref', 'streetViewService', function AddStreetViewCtrl($location, $log, $routeParams, $timeout, $firebaseArray, Ref, streetViewService) {
    var vm = this;
    vm.userViews = {};
    vm.currentUserId = -1;
    vm.msginfo = null;
    vm.errType = 'default';
    vm.username = null;

    var authData = Ref.getAuth();

    if (authData) {
        console.log('Authenticated user with uid:', authData.uid);
        vm.currentUserId = authData.uid;
    }
    
    else {
        console.log('User not authenticated');
		window.location.href = '#/login';
    }

vm.addStreetView = addStreetView;
vm.currentStreetView = {title: '', description : null, descriptionsource : null, place : null, panoId : null, userId : vm.currentUserId, ownerId : vm.currentUserId, ownername : ''};  

 function addStreetView() {
     vm.msginfo = null;
     vm.errType = null;
     
        if( vm.currentStreetView ) {

           console.log('[AddStreetViewCtrl] start from addStreetView');          
           console.log('[AddStreetViewCtrl] start from addStreetView' + vm.currentStreetView.title);
           console.log('[AddStreetViewCtrl] start from addStreetView.panoid' + vm.currentStreetView.panoId);

           addView(vm.currentStreetView);
        }
    }
        function addView(view)
        {   vm.msginfo = null;
            vm.errType = null;
            console.log('[AddStreetViewCtrl] addView start from addStreetView.title' + view.title);

            var array = $firebaseArray(Ref.child('views').orderByChild('panoId').equalTo(view.panoId));
            array.$loaded().then(function(views) {
            if (views.length >= 1)
            {
                error('StreetView already exist','default');
            }
            else
            {
                $log.debug('[Service] Info: StreetView not found');

                var viewsRef = Ref.child('views');
                viewsRef.push().set({
                title: view.title,
                description: view.description,
                descriptionsource : view.descriptionsource,
                place: view.place,
                panoId : view.panoId,
                userId : view.userId,
                ownerId : view.ownerId,
                ownername : view.ownername,
                date : new Date()
                }, function(error) {
                if (error) {
                    error('Errors while saving new StreetView', 'danger');
                } else {
                    success('StreetView saved sucessfully', 'sucess');
                }
                });          

                return 1;
            }
            });

            vm.currentStreetView = {};
        }

    function alert(msg, typ) {
        vm.msginfo = msg;
        vm.errType = typ;
        $timeout(function() {
        vm.msginfo = null;
        }, 5000);
    }

     function getUserViews() {
        console.log('[AddStreetViewCtrl] start from getUserViews');
        var authData = Ref.getAuth();
        if (authData) {
               vm.currentStreetView.userId = authData.uid;
                console.log('[AddStreetViewCtrl] Authenticated user with uid:', authData.uid);
                vm.userViews = streetViewService.getUserViews(authData.uid);
                vm.userViews.$loaded().catch(alert);
        }
	  }

    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    getUserViews();     

}]);
