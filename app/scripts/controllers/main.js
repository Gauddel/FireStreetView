'use strict';

angular.module('jujuvu2App')
.controller('MainCtrl', ['$rootScope','Ref', 'streetViewService', function MainCtrl($rootScope, Ref, streetViewService) {
    var vm = this;
    vm.title = 'FireView';
    vm.views = {};
    vm.userViews = {};

    $rootScope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    getTop10(); 
    getUserViews();

    function getTop10() {
      console.log('[mainCtrl] start from getTop10');
      vm.views = streetViewService.getTop10();
      
	  }   

    function getUserViews() {
      console.log('[mainCtrl] start from getUserViews');
      var authData = Ref.getAuth();
      if (authData) {
            console.log('[mainCtrl] Authenticated user with uid:', authData.uid);
            vm.userViews = streetViewService.getUserViews(authData.uid);
           // vm.userViews.$loaded().catch(alert);
      }
	  }

  vm.initPano = function initializeAllPanos() {
    setStreetViewPanorama('panoMain', 'V1OQROuLqFoAAAQ0INbo8w', 0, 0);
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
vm.initPano();

}]);


