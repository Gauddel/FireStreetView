'use strict';


angular.module('jujuvu2App')
.factory('streetViewService', ['$log', '$firebaseObject', '$firebaseArray','Ref', function streetViewService($log, $firebaseObject, $firebaseArray, Ref) {
        const maxTop = 10;        
        var currentView ;
        var viewToDelete = null;
        var service = {};
                
        service.getTop10 = getTop10;
        service.getViewById = getViewById;
        service.getProfileById = getProfileById;       
        service.getCurrentProfile = getCurrentProfile;
        service.getUserViews = getUserViews;
        service.getStreetViewByPanoId = getStreetViewByPanoId;
        service.removeView = removeView;
        service.removeViewFromMyGallery = removeViewFromMyGallery;
 
        function getViewById(viewId) {
        	$log.debug('[Service] Call GetViewById :'+ viewId);
        }

        function getView() {
        	$log.debug('[Service] Call GetView :'+currentView);
        }

        function getProfileByEmail(email) {
            $log.debug('[Service] Call getProfileByEmail :'+email);
            return $firebaseObject(Ref.child(escapeEmailAddress(email)));
        }

        function getProfileById(uid) {
            $log.debug('[Service] Call getProfileById :' + uid);
            return $firebaseObject(Ref.child('users/' + uid));
        }

        function getTop10() {
        	$log.debug('[Service] Call GetTop10');
            return $firebaseArray(Ref.child('views').limitToLast(maxTop));
        }
        
        function getCurrentProfile() 
        {
            var authData = Ref.getAuth();

            if (authData) {
                console.log('Authenticated user with uid:', authData.uid);
                return $firebaseObject(Ref.child('users/' + authData.uid));
            }

            else {
                console.log('Not Authenticated user');
                return null;
            }           
        }  
        
        function getUserViews(uid) 
        {
            return $firebaseArray(Ref.child('views').orderByChild('userId').equalTo(uid));           
        }

        function getStreetViewByPanoId(panoId)
        {
            return $firebaseArray(Ref.child('views').orderByChild('panoId').equalTo(panoId).limitToFirst(1));           
        }

        function escapeEmailAddress(email) {
            if (!email) {
                return false;
            }
            else
            {
                // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
                email = email.toLowerCase();
                email = email.replace(/\./g, ',');
                return email;
            }
        }

        function addView(view, userId)
        {   
            var array = $firebaseArray(Ref.child('views').orderByChild('panoId').equalTo(view.panoId));
                var viewsRef = Ref.child('views');
                viewsRef.push().set({
                text: view.text,
                description: view.description,
                place: view.place,
                panoId : view.panoId,
                userId : userId,
                ownerId : view.ownerId,
                ownerName : view.ownerName
                }, function(error) {
                if (error) {
                    console.log('Errors while saving new StreetView');
                } else {
                    console.log('StreetView saved sucessfully');
                }
                });                
        }

        function removeView(view) {
            console.log('[Service] view  : ' + view.panoId );                          
            var viewsArray = $firebaseObject(Ref.child('views').orderByChild('panoId').equalTo(view.panoId));
            return viewsArray.$remove(view);
        }

        function removeViewFromMyGallery(panoId, userId) {         
            console.log('[Service] removeViewFromMyGallery panoId : ' + panoId + ' userId : ' + userId);                          
            var viewsRefPano = Ref.child('views').orderByChild('panoId').equalTo(panoId);  

            viewsRefPano.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                console.log(childData);
                if (childData.userId === userId) {
                    removeView(childData);
                }
            });
            });
        }
        
        return service;

    }]);




