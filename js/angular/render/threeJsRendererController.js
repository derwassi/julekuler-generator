angular.module('kpg.controller.render.threeJs',[])
    .controller('kpgRenderThreeJs', ['$scope','traversePatternFactory','modelService',  function($scope,traversePatternFactory,modelService) {
        $scope.patternService = traversePatternFactory({
            centerWidth: 16,
            centerHeight: 13,
            lineHeight: 2
        });
        $scope.modelService = modelService;

    }]);