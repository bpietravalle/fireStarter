(function(angular) {
    'use strict';
    angular
        .module('fb.constant', [])
        .constant('FBURL', 'https://your-firebase.firebaseio.com/')
        .constant('GFURL', 'geofire');

				//TODO: need to import the url - 
				//possible(from SO)
				//function defive(name, value){
				//Object.defineProperty(exports, name,{
				//value: value,
				//enumberable: true
				//});
				//}

})(angular);
