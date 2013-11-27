/**
 * Created by wassi on 26.11.13.
 */

angular.module('kpg.service.pattern.pattern', [])
    .factory('traversePatternFactory', function () {
        var defaults = {
            centerWidth: 16,
            centerHeight: 13,
            lineHeight: 2

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

        var drawPattern = function (config, drawFunc) {
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
        };

        var copyOver = function (config, from, to, drawFunc) {
            drawPattern(config,function (row, col) {
                if (col >= from * config.centerWidth && col < (from + 1) * config.centerWidth) {
                    var val = parseInt($('#pixel-' + row + '-' + col).attr('data-color'));
                    var $el = $('#pixel-' + row + '-' + (col - (copy[0] * centerWidth) + (copy[1] * centerWidth)));
                    $el.attr('data-color', val);
                    $el.css('background-color', colors[val]);
                }
            });
        };

        var isInPattern = function (config, row, col, drawFunc) {
            return true; //TODO: implement
        };
        return function (config) {
            config = angular.extend(config, defaults);
            return {
                /**
                 * traverses the pattern
                 * @param drawFunc
                 */
                traversePattern: function (drawFunc) {
                    drawPattern(config, drawFunc);
                },
                /**
                 * checks if a given coord is within the pattern
                 * @param row
                 * @param col
                 * @param drawFunc
                 * @returns {*}
                 */
                isInPattern: function (row, col, drawFunc) {
                    return isInPattern(config, row, col, drawFunc);
                },
                /**
                 * copies symmetric parts of the pattern into each others
                 * @param from
                 * @param to
                 * @param patternModel
                 */
                copyOver: function (from, to, patternModel) {
                    drawPattern(config, function (row, col) {
                        if (col >= from * config.centerWidth && col < (from + 1) * config.centerWidth) {
                            var val = patternModel.getColorAt(row, col);
                            var newCol = (col + ((to < from ? to + 4 : to) - from) * config.centerWidth) % (4 * config.centerWidth);
                            patternModel.setColorAt(row, newCol,val);
                        }
                    });
                },
                /**
                 * eturns a list of symmetry points for a given point
                 * @param row
                 * @param col
                 * @returns {Array}
                 */
                getSymmetricPoints: function (row, col) {
                    var res = [];
                    for (var i = 1; i < 4; i++) {
                        res[i - 1] = {row: row, col: (col + i * config.centerWidth) % (4 * config.centerWidth)};
                    }
                    return res;
                },
                getNumberOfSymmetricAreas:function(){
                    return 4;
                }



            };
        }
    });

