/**
 * Created by wassi on 26.11.13.
 */

var createJulekulerCanvas = function(config){
    var a = config.sideLength;//TODO: config

    traverseDrawingSurface(config.centerWidth,config.centerHeight,function(row,col){
        $("#drawing")
            .append($('<div></div>')
                .css('width',a+'px')
                .css('height',a+'px')
                .css('left',col*a + 'px')
                .css('top',row*a + 'px')
                .attr('id','pixel-'+row+'-'+col));

    });
};

$("#drawing >div").click(function(el){
    $el = $(el.target);
    var c = parseInt($el.attr('data-color'));
    if(c == curCol){
        $el.attr('data-color',0);
    }else{
        $el.attr('data-color',curCol);
    }
    var c = parseInt($el.attr('data-color'));
    $el.css('background-color',colors[c]);
    if($('#insync').is(':checked')){
        var pos = $el.attr('id').split('-');
        for(var i=1;i<4;i++){
            console.log('#pixel-' + pos[1]+'-'+((parseInt(pos[2])+i*centerWidth)%(4*centerWidth)));
            $el = $('#pixel-' + pos[1]+'-'+((parseInt(pos[2])+i*centerWidth)%(4*centerWidth)));
            $el.css('background-color',colors[c]);
            $el.attr('data-color',c);
        }
    }
    return false;

});

$("#copyover").change(function(){
    console.log($(this).val());
    $.each($(this).val().split('|'),function(k,v){
        var copy=v.split('-');
        copy[0]=parseInt(copy[0])-1;
        copy[1]=parseInt(copy[1])-1;
        console.log(copy);
        traverseDrawingSurface(16,13,function(row,col){
            if(col>=copy[0]*centerWidth && col<(copy[0]+1)*centerWidth){
                var val = parseInt($('#pixel-'+row+'-'+col).attr('data-color'));
                var $el = $('#pixel-'+row+'-'+(col-(copy[0]*centerWidth)+(copy[1]*centerWidth)));
                $el.attr('data-color',val);
                $el.css('background-color',colors[val]);
            }
        });
    });
    $(this).val("");
    redraw();
    texture1.needsUpdate = true;
});
