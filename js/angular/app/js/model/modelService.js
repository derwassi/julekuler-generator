/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.service.model.model', []).
    factory('modelService',function(){
        var pattern = {};

        var colors = {0:'white',
            1: '#D13535',
            2: '#580F0F',
            3: '#98BABD',
            4 : '#26436E',
            5: '#021530'};
        var listeners = {};
        var colorListeners = [];
        return {
            colors:{
                getColor:function(color){
                    return colors[color];
                 },
                addListener:function(listener){
                    colorListeners.push(listener);

                },
                setColor:function(color,col){
                    colors[color] = col;
                    for(var l in colorListeners){
                        colorListeners[l](color);
                    }
                },
                getColors:function(){
                    return colors;
                }
            },

            currentColor:0,
            symmetricEditing: false,

            pattern: {
                /**
                 * returns the color at a specific point
                 * @param row
                 * @param col
                 * @returns {*}
                 */
                getColorAt:function(row,col){
                    if(typeof pattern[row] == 'undefined'){
                        pattern[row] = {};
                    }
                    if(typeof pattern[row][col] == 'undefined'){
                        pattern[row][col] = 0
                    }
                    return pattern[row][col];
                },
                /**
                 * Set color and notify listeners
                 * @param row
                 * @param col
                 * @param c
                 * @returns {boolean}
                 */
                setColorAt:function(row,col,c){
                    if(typeof pattern[row] == 'undefined'){
                        pattern[row] = {};
                    }
                    if(pattern[row][col] != c){
                        var oldCol = pattern[row][col];
                        pattern[row][col] = c;
                        if(listeners[row] && listeners[row][col]){
                            for(var l in listeners[row][col]){
                                listeners[row][col][l](row,col,oldCol,c);
                            }
                        }
                        return true;
                    }else{
                        return false;
                    }

                },
                /**
                 * adds a listener for a specific pixel
                 * @param row
                 * @param col
                 * @param listener
                 */
                addListener:function(row,col,listener){
                    if(typeof listeners[row] === 'undefined'){
                        listeners[row] = {};
                    }
                    if(typeof listeners[row][col] === 'undefined'){
                        listeners[row][col] = [];
                    }
                    listeners[row][col].push(listener);
                },



            },

            patternConfig: {},
            title:''
        };
    });