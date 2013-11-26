/**
 * Created by wassi on 26.11.13.
 */

$("#save-to-image").click(function(){
    var exportCanvas = $('#export-image')[0];
    var exportContext = exportCanvas.getContext('2d');
    exportContext.strokeStyle = "#000";
    exportContext.fillStyle='#fff';

    exportContext.fillRect(0,0,exportCanvas.width,exportCanvas.height);
    exportContext.fillStyle='#000';

    exportContext.font = '60pt Arial';
    var top= 80;
    var left=20;
    exportContext.fillText($('#title').val(),left,top);

    top=1004;
    var a = 20;
    exportContext.font = '10pt Arial';
    exportContext.fillText('created using julekuler-generator on ' + window.location.protocol+"//"+window.location.host+window.location.pathname,left,top);


    top = 120
    exportContext.font = '20pt Arial';
    var textWidth = exportContext.measureText('Colors:');
    exportContext.fillText('Colors:',left,top+20);

    for(var color in colors){
        exportContext.beginPath();
        exportContext.fillStyle = colors[color];
        exportContext.rect(textWidth.width + a+ color*a*2+left,top,a,a);
        exportContext.fill();
        exportContext.stroke();
    }
    exportContext.fillStyle='#fff';
    top= 170;

    traverseDrawingSurface(16,13,function(row,col){
        exportContext.fillStyle = colors[parseInt($('#pixel-'+row+'-'+col).attr('data-color'))];
        console.log('.');
        exportContext.beginPath();
        exportContext.rect(col*a+left,row*a+top,a,a);
        exportContext.fill();
        exportContext.stroke();

    });
    Canvas2Image.saveAsPNG(exportCanvas);
    return false;
});
