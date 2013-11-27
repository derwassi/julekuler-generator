/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.service.persist.image', [])
    .factory('exportImage', function () {
        var exportCanvas = document.createElement('canvas');
        var exportContext = exportCanvas.getContext('2d');

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
            width: 1024,
            height: 768,
            footer: {
                prefix: 'created using julekuler-generator on ',
                top: 1004,
                left: 20,
                font: '10pt Arial'

            },
            colors:{
                prefix:'Colors:',
                top:140,
                left:20,
                font:'20pt Arial'

            }

        };

        return  {
            /**
             * draws pattern into canvas and exports it as an image (requires Canvas2Image library)
             *
             * @param modelService model
             * @param patternService patternService
             * @param Object config
             */
            download: function (model,patternService,config) {
                config = defaults;
                exportCanvas.width = config.width;
                exportCanvas.height = config.height;
                exportContext.strokeStyle = config.pattern.strokeColor;
                exportContext.fillStyle = config.background.color;
                exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                exportContext.fillStyle = config.title.color;
                exportContext.font = config.title.font;
                exportContext.fillText(modelService.title, config.title.left, config.title.top);
                exportContext.font = config.footer.font;
                exportContext.fillText(config.footer.prefix+ window.location.protocol + "//" + window.location.host + window.location.pathname, config.footer.left, config.footer.top);
                exportContext.font = config.colors.font;
                var textWidth = exportContext.measureText(config.colors.prefix);
                exportContext.fillText(config.colors.prefix, config.colors.left,config.colors.top);

                for (var color in model.colors) {
                    exportContext.beginPath();
                    exportContext.fillStyle = colors[color];
                    exportContext.rect(textWidth.width + a + color * a * 2 + left, top, a, a);
                    exportContext.fill();
                    exportContext.stroke();
                }

                exportContext.fillStyle = config.background.color;

                patternService.traversePattern(function (row, col) {
                    var col = model.pattern.getColor(row,col);
                    exportContext.fillStyle = colors[col];
                    exportContext.beginPath();
                    exportContext.rect(col * config.pattern.elementWidth + left, row * config.pattern.elementWidth + top, config.pattern.elementWidth, config.pattern.elementWidth);
                    exportContext.fill();
                    exportContext.stroke();

                });

                Canvas2Image.saveAsPNG(exportCanvas);

            }
        };





    });
