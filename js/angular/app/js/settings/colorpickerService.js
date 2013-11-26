/**
 * Created by wassi on 26.11.13.
 */

var updateColors = function(){
    colors=[];

    $.each(	$("#colors > div"), function(idx, el){
        colors[parseInt($(el).attr('data-color'))] = $('.picker', el).css('background-color');
    });

    createColorPicker(colors);
    traverseDrawingSurface(16,13,function(row,col){
        $el = $('#pixel-'+row+'-'+col);
        var val = parseInt($el.attr('data-color'));
        $el.css('background-color',colors[val]);
    });
    julekulerTexture.needsUpdate=true;

}

var createColorPicker=function(colors){
    $('#colors').empty();
    var i=0;
    for(var color in colors){
        var $picker = $('<div class="picker"></div>').css('background-color',colors[color])
        $('#colors').append($('<div><div class="edit"></div></div>').attr('data-color',color).prepend($picker));
        if(i++>=8) break;
    }
    $('#colors>div .picker').click(function(el){
        curCol = parseInt($(el.target).parent().attr('data-color'));
        $('#colors>div .picker').removeClass('current');
        $(el.target).addClass('current');
    });
    $.each(	$("#colors > div"), function(idx, el){
        console.log(el);
        console.log($('.picker', $(el)).css('background-color'));
        $('.edit',$(el)).ColorPicker({
            flat: false,
            color: rgb2hex($('.picker', $(el)).css('background-color')),
            onSubmit: function(hsb, hex, rgb) {
                console.log(hex);
                $('.picker', $(el)).css('background-color','#' + hex);
                updateColors();
            }
        });

    });
};
