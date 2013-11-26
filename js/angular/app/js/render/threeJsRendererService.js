/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.services', [])
    .factory('buildStuff',function(){

    })
///
var initThreeJs = function(container){
    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    // create a WebGL renderer, camera
    // and a scene
    //checkfor webgl
    if(!Modernizr.canvas){
        return;
    }

    var _canvas= document.createElement("canvas");
    var gl = _canvas.getContext("webgl");
    useCanvas =Modernizr.webgl && gl

    if(useCanvas){
        renderer = new THREE.WebGLRenderer();

    }else{
        radius = 50;
        segments = 20;
        rings = 14;
        renderer = new THREE.CanvasRenderer();
    }
    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    renderer.setClearColorHex(0x333F47, 1);
    imgObj.src = 'images/bg.png';
    imgObj.onload = function(){
        woolCanvas.getContext('2d').drawImage(imgObj,0,0,125,150,0,0,woolCanvas.width,woolCanvas.height);
        redraw();
    }
    scene = new THREE.Scene();

    //add the camera to the scene
    scene.add(camera);
    // CONTROLS

    //the camera starts at 0,0,0
    //so pull it back
    camera.position.z = 300;

    //start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    controls = new THREE.OrbitControls( camera, renderer.domElement );


    //attach the render-supplied DOM element
    container.append(renderer.domElement);


    // create a point light
    /*var pointLight =
     new THREE.PointLight(0xFFFFFF);

     // set its position
     pointLight.position.x = 10;
     pointLight.position.y = 50;
     pointLight.position.z = -130;
     scene.add(pointLight);*/
    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    /*var directionalLight = new THREE.DirectionalLight(0xffffff);
     directionalLight.position.set(1, 1, 1).normalize();
     scene.add(directionalLight);*/
    renderer.render(scene, camera);
};

var addJulekuler = function(config){
    canvas = $('#texture')[0]
    context = canvas.getContext("2d");
    canvasStretched = $('#texture-stretched')[0]
    contextStretched = canvasStretched.getContext("2d");

    julekulerTexture = new THREE.Texture(canvasStretched);
    var material1 = new THREE.MeshLambertMaterial( {map: julekulerTexture} );
    var mesh1 = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            segments,
            rings),
        material1
    );
    // changes to the vertices
    mesh1.geometry.verticesNeedUpdate = true;

    // changes to the normals
    mesh1.geometry.normalsNeedUpdate = true;
    scene.add(mesh1);
    scene.needsUpdate = true;

    // add to the scene

};

var redraw = function(config){
    var a = 10;

    context.fillStyle='#aaa';
    context.fillRect(0,0,640,410);
    var lastcol = null;
    traverseDrawingSurface(16,13,function(row,col){
        var c=parseInt($('#pixel-'+row+'-'+col).attr('data-color'));
        if(!c) c =0;
        if(c!=lastcol){
            console.log()
            colorContext.fillStyle=colors[c];
            colorContext.fillRect(0,0,1,1);
            var myCol = colorContext.getImageData(0,0,1,1);
            colorContext.drawImage(woolCanvas,0,0);
            colorContext.clearRect(0,0,colorCanvas.width,colorCanvas.height);

            var pixels = woolContext.getImageData(0,0,colorCanvas.width, colorCanvas.height);
            for(var i=0;i<pixels.data.length;i++){
                pixels.data[i] = pixels.data[i]/255.0*myCol.data[i%4];

            }
            colorContext.putImageData(pixels,0,0);
        }

        lastcol = c;
        context.fillStyle=colors[c];
        //context.drawImage(imgObj,0,0,125,150,5*col,5*row,5,5);
        //context.fillRect(50*col,50*row,50,50);
        context.drawImage(colorCanvas,0,0,14,18,a*col,a*row-4,10,18);

        //context.fillStyle = '#000';
        //context.fillRect(col,row,10,10);
    });

    contextStretched.drawImage(canvas,0,0);
    for(var i=0;i<7;i++){
        for(var j=0;j<4;j++){
            var fromx=j*16*a+(16/2-(i+1))*a;
            var fromy=i*2*a;
            var fromwidth=(i+1)*2*a;
            var fromheight=2*a;
            var tox=j*16*a;
            var toy=i*2*a;
            var towidth=16*a;
            var toheight=2*a;
            console.log(fromx,fromy,fromwidth,fromheight,tox,toy,towidth,toheight);
            contextStretched.drawImage(canvas,fromx ,fromy ,fromwidth ,fromheight ,tox ,toy , towidth, toheight);
            contextStretched.drawImage(canvas,fromx ,41*a-fromy-2*a ,fromwidth ,fromheight ,tox ,41*a-toy-2*a , towidth, toheight);
        }

    }
    julekulerTexture.needsUpdate = true;
    scene.needsUpdate=true;


};

var animateThreeJs = function(){

    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animateThreeJs);

    // Render the scene.
    renderer.render(scene, camera);
    controls.update();
}