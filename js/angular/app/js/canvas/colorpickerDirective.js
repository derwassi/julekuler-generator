/**
 * Created by wassi on 26.11.13.
 */



angular.module('kpg.directive.canvas.colorpicker', [])
    .directive('kpgCanvasColorpicker', function () {

        var scope = null;

        var createColorPicker = function (element, model) {
            var colors = model.colors;
            var children = angular.element(element).children();
            if (children.length > 0) {
                children.remove();
            }
            console.log(model.colors);
            var i = 0;
            angular.forEach(colors.getColors(), function (color, index) {
                if (i++ < 8) {
                    var $picker = angular.element('<div class="picker"></div>').css('background-color', color);
                    var $selector = angular.element('<div class="edit"></div>');
                    angular.element(element).append(angular.element('<div></div>').append($selector).prepend($picker));
                    //TODO: watch model.colors and currentColor to update
                    $selector.ColorPicker({
                        flat: false,
                        color: color,
                        onSubmit: function (hsb, hex, rgb) {
                            $picker.css('background-color', '#' + hex);
                            //TODO: set via event + controller
                            model.colors.setColor(index, '#' + hex);
                        }
                    });

                    $picker.click(function () {
                       // scope.changeColor(index);

                        model.currentColor = index;
                        //TODO: set via event + controller
                        angular.element('.picker', element).removeClass('current');
                        $picker.addClass('current');
                    })
                }

            });

        };

        return{
            //TODO: fetch services from attributes
            link: function ($scope, element, attrs) {
                scope = $scope;
                createColorPicker(element, $scope.modelService);
            }
        };
    });