/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.services', []).
    factory('modelService',function(){
        return {
            colors:{0:'white',
                1: '#D13535',
                2: '#580F0F',
                3: '#98BABD',
                4 : '#26436E',
                5: '#021530'},
            pattern:{},
            patternConfig: {},
            title:{}
        };
    });