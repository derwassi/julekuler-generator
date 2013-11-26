/**
 * Created by wassi on 26.11.13.
 */

angular.module('kpg.pattern.service.pattern', [])
    .factory('traversePatternFactory', function () {
        var defaults = {
            centerWidth:16,
            centerHeight:13,
            lineHeight:2

        };


        var drawTriangle = function (baseline, lineHeight, drawFunc, rev) {
            var line = 0;
            var items = 2;
            var curLineHeight = 0;
            var indent = baseline / 2 - items / 2;
            while (items < baseline) {
                //hack for first and last rows!
                for (var i = 0 - ((rev && items == 2) ? 1 : 0); i < items + ((!rev && items == 2) ? 1 : 0); i++) {
                    drawFunc(line, i + indent);
                }
                line++;
                curLineHeight++;
                if (curLineHeight >= lineHeight) {
                    curLineHeight = 0;
                    items += 2;
                    indent = baseline / 2 - items / 2;
                }

            }
        };
        var drawRectangle = function (centerWidth, centerHeight, drawFunc) {
            for (var i = 0; i < centerHeight; i++) {
                for (var j = 0; j < centerWidth; j++) {
                    drawFunc(i, j);
                }
            }
        };

        var drawPattern = function(config){
            for (var i = 0; i < 4; i++) {
                drawTriangle(config.centerWidth, config.lineHeight, function (row, col) {
                    drawFunc(row, i * config.centerWidth + col);
                }, true);
                drawRectangle(config.centerWidth, config.centerHeight, function (row, col) {
                    drawFunc(row + config.centerWidth - 2, i * config.centerWidth + col);
                });
                drawTriangle(config.centerWidth, config.lineHeight, function (row, col) {
                    drawFunc(2 * (config.centerWidth - 2) + config.centerHeight - row - 1, i * config.centerWidth + col);
                }, false);
            }
        }

        var isInPattern = function(config,row,col){
            return true; //TODO: implement
        }
        return function(config){
            angular.extend(config,defaults);
            return {
                traversePattern:function(drawFunc){
                    drawPattern(config);
                },
                isInPattern:function(row,col){
                    return isInPattern(config,row,col);
                }
            }
        }
    })

