/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.service.persist.image', [])
    .factory('imageService', function () {
        var exportCanvas = document.createElement('canvas');
        var exportContext = exportCanvas.getContext('2d');
        //angular.element('body').append(exportCanvas);
        var defaults = {
            title: {
                top: 80,
                left: 20,
                font: '60pt Arial',
                color: '#000000'
            },
            background: {
                color: '#fff'
            },
            pattern: {
                strokeColor: '#000',
                elementWidth: 20,
                top:170,
                left:20
            },
            width: 1320,
            height: 1050,
            footer: {
                prefix: 'created using julekuler-generator on ',
                top: 1024,
                left: 20,
                font: '10pt Arial'

            },
            colors:{
                prefix:'Colors:',
                top:120,
                left:20,
                height:20,
                font:'20pt Arial'

            }

        };

        return  {
            /**
             * draws pattern into canvas and exports it as an image (requires Canvas2Image library)
             *
             * @param model
             * @param patternService patternService
             * @param config
             */
            download: function (model,patternService,config) {

                config = angular.extend(config,defaults);
                var a=config.pattern.elementWidth;
                exportCanvas.width = config.width;
                exportCanvas.height = config.height;
                exportContext.strokeStyle = config.pattern.strokeColor;
                exportContext.fillStyle = config.background.color;
                exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                exportContext.fillStyle = config.title.color;
                exportContext.font = config.title.font;
                exportContext.fillText(model.title, config.title.left, config.title.top);
                exportContext.font = config.footer.font;
                exportContext.fillText(config.footer.prefix+ window.location.protocol + "//" + window.location.host + window.location.pathname, config.footer.left, config.footer.top);
                exportContext.font = config.colors.font;
                var textWidth = exportContext.measureText(config.colors.prefix);
                exportContext.fillText(config.colors.prefix, config.colors.left,config.colors.top+config.colors.height);

                for (var color in model.colors.getColors()) {
                    exportContext.beginPath();
                    exportContext.fillStyle = model.colors.getColor(color);
                    exportContext.rect(textWidth.width + a + color * a * 2 + config.colors.left, config.colors.top, a, a);
                    exportContext.fill();
                    exportContext.stroke();
                }

                exportContext.fillStyle = config.background.color;
                exportContext.strokeStyle = config.pattern.strokeStyle;
                patternService.traversePattern(function (row, col) {
                    var color = model.pattern.getColorAt(row,col);

                    exportContext.fillStyle = model.colors.getColor(color);
                    exportContext.beginPath();
                    exportContext.rect(col * config.pattern.elementWidth + config.pattern.left, row * config.pattern.elementWidth + config.pattern.top, config.pattern.elementWidth, config.pattern.elementWidth);
                    exportContext.fill();
                    exportContext.stroke();

                });

               Canvas2Image.saveAsPNG(exportCanvas);

            }
        };





    });
