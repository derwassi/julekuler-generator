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
  
//the camera starts at 0,0,0
//so pull it back
camera.position.z = 300;
  
//start the renderer
renderer.setSize(WIDTH, HEIGHT);
  
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
    radius,
    segments,
    rings),

  sphereMaterial);

// add the sphere to the scene
scene.add(sphere);

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

// add to the scene
scene.add(pointLight);

// draw!
renderer.render(scene, camera);

// sphere geometry
sphere.geometry

// which contains the vertices and faces
sphere.geometry.vertices // an array
sphere.geometry.faces // also an array

// its position
sphere.position // contains x, y and z
sphere.rotation // same
sphere.scale // ... same

// set the geometry to dynamic
// so that it allow updates
sphere.geometry.dynamic = true;

// changes to the vertices
sphere.geometry.verticesNeedUpdate = true;

// changes to the normals
sphere.geometry.normalsNeedUpdate = true;

var createDrawingSurface = function(centerWidth, centerHeight, drawFunc){
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
createDrawingSurface(16,13,function(row,col){
$("#drawing").append($('<div></div>').css('width',a+'px').css('height',a+'px').css('left',col*a + 'px').css('top',row*a + 'px'));
console.log(num++ + ": " + row+" " + col);
});
