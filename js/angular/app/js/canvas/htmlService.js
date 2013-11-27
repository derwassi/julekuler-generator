/**
 * Created by wassi on 26.11.13.
 */


angular.module('kpg.service.canvas.html', [])
    .factory('canvasActions', function () {
        var defaults = {
            elementWidth: 10
        };


        return {
            /**
             * creates the "canväs" area to draw your pattern on
             * @param element
             * @param patternService
             * @param config
             * @param modelService
             */
            createCanvas: function (element, patternService, modelService, config) {
                angular.extend(config, defaults);
                patternService.traversePattern(function (row, col) {

                    var el = gular.element('<div></div>')
                        .css('width', config.elementWidth + 'px')
                        .css('height', config.elementWidth + 'px')
                        .css('left', col * config.elementWidth + 'px')
                        .css('top', row * config.elementWidth + 'px')
                        .attr('id', 'pixel-' + row + '-' + col);
                    angular.element(element).append(el);
                    //manual listener: as we don't $watch $scope directly, dirty checking could be inefficient ni angular ith so many items...
                    modelService.pattern.addListener(row, col, function (newColor, oldColor) {
                        el.css('background-color', modelService.colors[newColor]);
                    });

                });
            }
        };

    });

