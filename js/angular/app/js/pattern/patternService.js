/**
 * Created by wassi on 26.11.13.
 */

angular.module('kpg.service',[])
    .factory('traversePattern',function(conf){



        var drawTriangle = function(baseline, lineHeight,drawFunc, rev){
            var line = 0;
            var items = 2;
            var curLineHeight = 0;
            var indent = baseline/2-items/2;
            while(items<baseline){
                //hack for first and last rows!
                for(var i=0-((rev&&items==2)?1:0);i<items+((!rev && items==2)?1:0);i++){
                    drawFunc(line,i+indent);
                }
                line++;
                curLineHeight++;
                if(curLineHeight>=lineHeight){
                    curLineHeight=0;
                    items+=2;
                    indent = baseline/2-items/2;
                }

            }
        };
        var drawRectangle = function(centerWidth,centerHeight,drawFunc){
            for(var i=0;i<centerHeight;i++){
                for(var j=0;j<centerWidth;j++){
                    drawFunc(i,j);
                }
            }
        };
        for(var i=0;i<4;i++){
            drawTriangle(centerWidth,2,function(row,col){
                drawFunc(row,i*centerWidth+col);
            },true);
            drawRectangle(centerWidth,centerHeight,function(row,col){
                drawFunc(row+centerWidth-2,i*centerWidth+col);
            });
            drawTriangle(centerWidth,2,function(row,col){
                drawFunc(2*(centerWidth-2)+centerHeight-row-1,i*centerWidth+col);
            },false);
        }
    })
    .factory('isInPattern', function(){

    });

var traverseDrawingSurface = function(centerWidth, centerHeight, drawFunc){


};