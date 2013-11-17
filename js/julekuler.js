(function(){

window.julekuler = {};
var WIDTH = 400,
HEIGHT = 300;
// set some camera attributes
var VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = 0.1,
FAR = 10000;

// set up the sphere vars
var radius = 50,
    segments = 64,
    rings = 41;
var colors = {
	0:'white',
	1: '#D13535',
	2: '#580F0F',
	3: '#98BABD',
	4 : '#26436E',
	5: '#021530'
};

var renderer;
var scene;
var camera;
var canvas;
var context;
var canvasStretched;
var contextStretched;
var julekulerTexture;
var curCol=0;
var imgObj = new Image();
var woolCanvas = document.createElement("canvas");
woolCanvas.width=14;
woolCanvas.height=18;
var woolContext = woolCanvas.getContext('2d');
var colorCanvas = document.createElement("canvas");
woolCanvas.width=14;
woolCanvas.height=18;
colorContext = colorCanvas.getContext('2d');


function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

var initThreeJs = function(container){
	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
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
	for(var i=0;i<4;i++){
		drawTriangle(centerWidth,2,function(row,col){
			drawFunc(row,i*centerWidth+col);
		});
		drawRectangle(centerWidth,centerHeight,function(row,col){
			drawFunc(row+centerWidth-2,i*centerWidth+col);
		});
		drawTriangle(centerWidth,2,function(row,col){
			drawFunc(2*(centerWidth-2)+centerHeight-row-1,i*centerWidth+col);
		});
	}
	
};

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

//Function to convert hex format to a rgb color
var rgb2hex=function(rgb){
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

var updateColors = function(){
	colors=[];
	$.each(	$("#colors > div"), function(idx, el){
		colors[parseInt($(el).attr('data-color'))] = $('.picker', el).css('background-color');
	});
	traverseDrawingSurface(16,13,function(row,col){
		$el = $('#pixel-'+row+'-'+col);
		var val = parseInt($el.attr('data-color'));
		$el.css('background-color',colors[val]);
	});
	julekulerTexture.needsUpdate=true;
	
}

var createColorPicker=function(colors){
	$('#colors').empty();
	for(var color in colors){
		var $picker = $('<div class="picker"></div>').css('background-color',colors[color])
		$('#colors').append($('<div><div class="edit"></div></div>').attr('data-color',color).prepend($picker));	
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

var addEvents = function(){
	var centerWidth=16;
	

	

	
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
		
	});
	$("#load").click(function(){
		var obj = JSON.parse($('#load-save').val());
		colors = obj.colors;
		createColorPicker(colors);
		traverseDrawingSurface(16,13,function(row,col){
				var $el = $('#pixel-'+row+'-'+col);
				$el.attr('data-color',obj.pattern[row][col]);
				$el.css('background-color',colors[obj.pattern[row][col]]);
			
			
		});
		redraw();
		texture1.needsUpdate = true;

	});
	$("#save").click(function(){
		var s = {};
		traverseDrawingSurface(16,13,function(row,col){
			var val = parseInt($('#pixel-'+row+'-'+col).attr('data-color'));
			if(!val) val=0;
			if(!s[row]) s[row] = {};
			
			s[row][col]=val;
		});
		$('#load-save').val(JSON.stringify({colors:colors,pattern:s}));	
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
	$("#update-3d-view").click(function(){
		redraw();
		texture1.needsUpdate = true;

	});
}






/**
* For controls
*/
var animateThreeJs = function(){

    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animateThreeJs);
     
    // Render the scene.
    renderer.render(scene, camera);
    controls.update();
}

window.julekuler = {};
window.julekuler.start = function(config){
//TODO config
	
	initThreeJs($('#container'));
	addJulekuler(config.julekuler);
	animateThreeJs();	
	requestAnimationFrame(animateThreeJs);
	createJulekulerCanvas(config.julekulerCanvas);
	createColorPicker(colors);
	
	addEvents();
	redraw();
	texture1.needsUpdate = true;
};


window.julekuler.start({julekulerCanvas:{centerWidth:16,centerHeight:13,sideLength:10}});








// draw!h




})();
