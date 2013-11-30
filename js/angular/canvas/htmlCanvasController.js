/**
 * Created by wassi on 26.11.13.
 */

angular.module('kpg.controller.canvas.html',[])
    .controller('canvasHtml', ['$scope','traversePatternFactory','modelService',  function($scope,traversePatternFactory,modelService) {
        $scope.patternService = traversePatternFactory({
            centerWidth: 16,
            centerHeight: 13,
            lineHeight: 2
        });

        $scope.modelService = modelService;

        /**
         * event handler for click events. propagate clicks to model changes
         * @param row
         * @param col
         */
        $scope.clickedPattern = function(row,col){
            var color = modelService.currentColor;
            if(modelService.pattern.getColorAt(row,col) == color){
                color = 0;
            }
            modelService.pattern.setColorAt(row,col,color);
            if(modelService.symmetricEditing){
                var sp = $scope.patternService.getSymmetricPoints(row,col);
                for(var p in sp){
                    modelService.pattern.setColorAt(sp[p].row, sp[p].col,color);
                }
            }
        };

    }]);