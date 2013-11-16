var WIDTH = 400,
HEIGHT = 300;
// set some camera attributes
var VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = 0.1,
FAR = 10000;
// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');
// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera =
new THREE.PerspectiveCamera(
VIEW_ANGLE,
ASPECT,
NEAR,
FAR);
  


var scene = new THREE.Scene();
  
//add the camera to the scene
scene.add(camera);
// CONTROLS
	
//the camera starts at 0,0,0
//so pull it back
camera.position.z = 300;
  
//start the renderer
renderer.setSize(WIDTH, HEIGHT);

controls = new THREE.OrbitControls( camera, renderer.domElement );
function animate() {
 
    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);
 
    // Render the scene.
    renderer.render(scene, camera);
    controls.update();
 
  }
requestAnimationFrame(animate);

//attach the render-supplied DOM element
$container.append(renderer.domElement);

// set up the sphere vars
var radius = 50,
    segments = 16,
    rings = 16;

// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
var sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    radius/2,
    segments/2,
    rings/2),

  sphereMaterial);
sphere.position.x=50;
sphere.position.y=50;
// add the sphere to the scene
//scene.add(sphere);

// create the sphere's material
var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000
    });

// create a point light
var pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;


// sphere geometry
sphere.geometry;

// which contains the vertices and faces
sphere.geometry.vertices; // an array
sphere.geometry.faces; // also an array

// its position
sphere.position; // contains x, y and z
sphere.rotation; // same
sphere.scale; // ... same

// set the geometry to dynamic
// so that it allow updates
sphere.geometry.dynamic = true;

// changes to the vertices
sphere.geometry.verticesNeedUpdate = true;

// changes to the normals
sphere.geometry.normalsNeedUpdate = true;

var traverseDrawingSurface = function(centerWidth, centerHeight, drawFunc){
	var drawTriangle = function(baseline, lineHeight,drawFunc){
		var line = 0;
		var items = 2;
		var curLineHeight = 0;
		var indent = baseline/2-items/2;
		while(items<baseline){
			for(var i=0;i<items;i++){
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
	drawTriangle(centerWidth,2,function(row,col){
		drawFunc(row,col);
	});
	drawRectangle(centerWidth,centerHeight,function(row,col){
		drawFunc(row+centerWidth-2,col);
	});
	drawTriangle(centerWidth,2,function(row,col){
		drawFunc(2*(centerWidth-2)+centerHeight-row-1,col);
	});
	
};
var num=0;
var a = 10;
traverseDrawingSurface(16,13,function(row,col){
$("#drawing").append($('<div></div>').css('width',a+'px').css('height',a+'px').css('left',col*a + 'px').css('top',row*a + 'px').attr('id','pixel-'+row+'-'+col));
console.log(num++ + ": " + row+" " + col);
});

var colors = {
0:'white',
1:'red',
2:'green',
3:'blue'
};

var createColorPicker=function(colors){
	for(var color in colors){
		$('#colors').append($('<div></div>').attr('data-color',color).css('background-color',colors[color]));	
	}
};



createColorPicker(colors);
var canvas = $('#texture')[0]
var context = canvas.getContext("2d");
var canvasStretched = $('#texture-stretched')[0]
var contextStretched = canvasStretched.getContext("2d");

var texture1 = new THREE.Texture(canvasStretched);
var material1 = new THREE.MeshBasicMaterial( {map: texture1, color:'#aaa'} );
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
scene.add(pointLight);

// draw!h
renderer.render(scene, camera);

var redraw=function(){
	context.fillStyle='#aaa';
	context.fillRect(0,0,640,400);
	traverseDrawingSurface(16,13,function(row,col){
		var c=parseInt($('#pixel-'+row+'-'+col).attr('data-color'));
		if(!c) c =0;
		context.fillStyle=colors[c];
		for(var i=0;i<4;i++){
			context.fillRect(i*80+5*col,5*row,5,5);

		}
		//context.fillStyle = '#000';
		//context.fillRect(col,row,10,10);
	});
	contextStretched.drawImage(canvas,0,0);
	for(var i=0;i<7;i++){
		for(var j=0;j<4;j++){
			var fromx=j*80+(16/2-(i+1))*5;
			var fromy=i*10;
			var fromwidth=(i+1)*2*5;
			var fromheight=10;
			var tox=j*80;
			var toy=i*10;
			var towidth=80;
			var toheight=10;
			console.log(fromx,fromy,fromwidth,fromheight,tox,toy,towidth,toheight);
			contextStretched.drawImage(canvas,fromx ,fromy ,fromwidth ,fromheight ,tox ,toy , towidth, toheight);
			contextStretched.drawImage(canvas,fromx ,205-fromy-10 ,fromwidth ,fromheight ,tox ,205-toy , towidth, toheight);
		}
			
	}
	texture1.needsUpdate = true;
	scene.needsUpdate=true;
	renderer.render(scene,camera);
	
};

var curCol=0;
$('#colors>div').click(function(el){
	curCol = parseInt($(el.target).attr('data-color'));
});

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
	redraw();
});
