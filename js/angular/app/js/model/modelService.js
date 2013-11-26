/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.service.model.model', []).
    factory('modelService',function(){
        var pattern = {}
        return {
            colors:{0:'white',
                1: '#D13535',
                2: '#580F0F',
                3: '#98BABD',
                4 : '#26436E',
                5: '#021530'},
            pattern: {
                getColorAt:function(row,col){
                    if(typeof pattern[row] === 'undefined'){
                        pattern[row] = {};
                    }
                    if(typeof pattern[row][col] === 'undefined'){
                        pattern[row][col] = 0
                    }
                    return pattern[row][col];
                },
                setColorAt:function(row,col,c){
                    if(typeof pattern[row] === 'undefined'){
                        pattern[row] = {};
                    }
                    pattern[row][col] = c;
                }

            },

            patternConfig: {},
            title:{}
        };
    });