'use strict';

angular.module('jujuvu2App')
  .controller('StreetViewCtrl',	['$log', '$scope', '$routeParams','Ref','streetViewService', function StreetViewCtrl($log, $scope, $routeParams, Ref, streetViewService) {
	var vm = this;
  vm.currentStreetViews = {};
  vm.userId = null; 
  vm.loadStreetView = loadStreetView;
  vm.addStreetView = addStreetView;
  vm.removeStreetView = removeStreetView;

  var authData = Ref.getAuth();
  if (authData) {
      vm.userId = authData.uid;
  }

  if(!($routeParams.panoId))
  {
    $log.info('[StreetViewCtrl] No parameter found');
  }
  else
  {
    $log.info('[StreetViewCtrl] PanoId parameter found ' + $routeParams.panoId); 
    vm.panoId = $routeParams.panoId;
  }
  
  vm.initPano = function initializeAllPanos() {
    setStreetViewPanorama('panoBig', vm.panoId, 0, 0);
  };

  function setStreetViewPanorama(divId, panoId, headingAngle, pitchAngle) {
  var panoramaOptions = {
    pov: {
      heading: headingAngle,
      pitch: pitchAngle,
      zoom: 1
    }
  };
  var panorama = new google.maps.StreetViewPanorama(document.getElementById(divId), panoramaOptions);
  panorama.setPano(panoId);

  window.setInterval(function() {
	var pov = panorama.getPov();
	pov.heading += 0.2;
	panorama.setPov(pov);
  }, 40);
}

function loadStreetView()
{
  vm.currentStreetViews = streetViewService.getStreetViewByPanoId(vm.panoId);
}

 function addStreetView(view) {
   //Can not save the same StreetView more than once
    if(( vm.currentStreetView ) && (vm.currentStreetView.userId != vm.userId)) {
        streetViewService.addView(view, vm.userId);
        success('StreetView has been added to your gallery', true);

    }
    else {
      error('StreetView has already been added to your gallery', true);
    }
  }

 function removeStreetView(view) {
    $scope.msg = null;
    $scope.type = 'default';
    $log.info('[StreetViewCtrl] streetViewService removeStreetView :' + view.ownerId + 'ooo' + vm.userId);
    if( view.ownerId === vm.userId) {
        $log.info('[StreetViewCtrl] call streetViewService.removeView');
        streetViewService.removeView(view).then(function() {
            success('StreetView has been removed from your gallery', true);
          }, error);;
    }
    else if( view.userId === vm.userId) {
        $log.info('[StreetViewCtrl] streetViewService.removeViewFromMyGallery');
        streetViewService.removeViewFromMyGallery(view.panoId, vm.userId).then(function(item) {   
        });;
    }
}

  function error(err) {
    alert(err, 'danger');
  }

  function success(msg, reset) {
    alert(msg, 'success');
    if(reset === true)
    {
      vm.panoId = '';
    }
  }

  function alert(msg, type) {
    $scope.msg = msg;
    $scope.type = type;
  }

vm.initPano();
vm.loadStreetView();

}]);
