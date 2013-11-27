'use strict';


// Declare app level module which depends on filters, and services
angular.module('kpg', [
  'ngRoute',
  //'kpg.filters',
//  'kpg.service.canvas.html',
    'kpg.service.pattern.pattern',
    //'kpg.service.persist.image',
    //'kpg.service.persist.url',
    'kpg.service.model.model',

  'kpg.directive.canvas.html',
  'kpg.controller.canvas.html'
]);
/*config(['$routeProvider', function($routeProvider) {
  $routeProvider.always({templateUrl: 'partials/content'})
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/

/*var loadFromUrl = function(){
    var hash=window.location.hash;
    if(hash.length>0) hash = hash.substr(1);
    loadPattern(decodeURIComponent(hash));

}

julekuler.start = function(config){
//TODO config

    initThreeJs($('#container'));
    addJulekuler(config.julekuler);
    animateThreeJs();
    requestAnimationFrame(animateThreeJs);
    createJulekulerCanvas(config.julekulerCanvas);
    createColorPicker(colors);

    addEvents();
    loadFromUrl();
    redraw();
    //texture1.needsUpdate = true;
};*/