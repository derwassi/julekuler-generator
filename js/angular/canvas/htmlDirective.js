angular.module('kpg.directive.canvas.html', [])
    .directive('kpgCanvasHtml', function () {
        var defaults = {
            elemWidth: 10
        };
        var scope = null;
        var createCanvas = function (element, patternService, modelService, config) {
            angular.extend(config, defaults);
            patternService.traversePattern(function (row, col) {
                var color = ''+modelService.pattern.getColorAt(row,col);
                var el = angular.element('<div></div>');
                el.css('width', config.elementWidth + 'px');
                el.css('height', config.elementWidth + 'px');
                el.css('left', col * config.elementWidth + 'px');
                el.css('top', row * config.elementWidth + 'px');
                el.attr('id', 'pixel-' + row + '-' + col);
                el.css('background-color', modelService.colors.getColor(color));
                el.on('click', function () {
                    scope.clickedPattern(row, col);
                });
                angular.element(element).append(el);
                //manual listener: as we don't $watch $scope directly, dirty checking could be inefficient ni angular ith so many items...
                modelService.pattern.addListener(row, col, function (r, c, oldColor, newColor) {
                    color = newColor;
                    el.css('background-color', modelService.colors.getColor(color));
                });
                modelService.colors.addListener(function (newColor) {
                    if (color == newColor) {
                        el.css('background-color', modelService.colors.getColor(color));
                    }
                });


            });
        };


        return{
            //TODO: fetch services from attributes
            link: function ($scope, element, attrs) {
                scope = $scope;
                createCanvas(element, $scope.patternService, $scope.modelService, {elementWidth: parseFloat(attrs.elemWidth)});
            }
        };
    });