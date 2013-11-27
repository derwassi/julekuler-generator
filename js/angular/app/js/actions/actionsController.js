angular.module('kpg.controller.actions.actions',[])
    .controller('actions', ['$scope','traversePatternFactory','modelService',  function($scope,traversePatternFactory,modelService) {
        $scope.patternService = traversePatternFactory({
            centerWidth: 16,
            centerHeight: 13,
            lineHeight: 2
        });


        /**
         * event handler for click events. propagate clicks to model changes
         * @param row
         * @param col
         */
        $scope.copyOver = function(from, to){
            $scope.patternService.copyOver(from,to,modelService.pattern);
        };

    }]);