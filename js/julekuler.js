(function(){

var julekuler = {};
var WIDTH = 400,
HEIGHT = 400;
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
var encodeMap = {0:"-",
1:".",
2:"/",
3:"0",
4:"1",
5:"2",
6:"3",
7:"4",
8:"5",
9:"6",
10:"7",
11:"8",
12:"9",
13:"B",
14:"C",
15:"D",
16:"E",
17:"F",
18:"G",
19:"H",
20:"I",
21:"J",
22:"K",
23:"L",
24:"M",
25:"N",
26:"O",
27:"P",
28:"Q",
29:"R",
30:"S",
31:"T",
32:"U",
33:"V",
34:"W",
35:"X",
36:"Y",
37:"Z",
38:"a",
39:"b",
40:"c",
41:"d",
42:"e",
43:"f",
44:"g",
45:"h",
46:"i",
47:"j",
48:"k",
49:"l",
50:"m",
51:"n",
52:"o",
53:"p",
54:"q",
55:"r",
56:"s",
57:"t",
58:"u",
59:"v",
60:"w",
61:"x",
62:"y",
63:"z"
} 
var decodeMap = {"-":0,
".":1,
"/":2,
"0":3,
"1":4,
"2":5,
"3":6,
"4":7,
"5":8,
"6":9,
"7":10,
"8":11,
"9":12,
"B":13,
"C":14,
"D":15,
"E":16,
"F":17,
"G":18,
"H":19,
"I":20,
"J":21,
"K":22,
"L":23,
"M":24,
"N":25,
"O":26,
"P":27,
"Q":28,
"R":29,
"S":30,
"T":31,
"U":32,
"V":33,
"W":34,
"X":35,
"Y":36,
"Z":37,
"a":38,
"b":39,
"c":40,
"d":41,
"e":42,
"f":43,
"g":44,
"h":45,
"i":46,
"j":47,
"k":48,
"l":49,
"m":50,
"n":51,
"o":52,
"p":53,
"q":54,
"r":55,
"s":56,
"t":57,
"u":58,
"v":59,
"w":60,
"x":61,
"y":62,
"z":63
}


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
	//checkfor webgl
	if(!Modernizr.canvas){
		return;
	}

	var _canvas= document.createElement("canvas");
	var gl = _canvas.getContext("webgl");
	if(Modernizr.webgl && gl){
		renderer = new THREE.WebGLRenderer();
	}else{
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

var traverseDrawingSurface = function(centerWidth, centerHeight, drawFunc){
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

	createColorPicker(colors);
	traverseDrawingSurface(16,13,function(row,col){
		$el = $('#pixel-'+row+'-'+col);
		var val = parseInt($el.attr('data-color'));
		$el.css('background-color',colors[val]);
	});
	julekulerTexture.needsUpdate=true;
	
}

julekuler.saveState = function(){
	var s = {};
	var i=0;
	var bin = 0;
	var delta = 42;//'0' char
	var res = '';
	traverseDrawingSurface(16,13,function(row,col){
		//convert to string, 6 colors = 3 bit => 6 bit for 2 fields => fits into 64 characters (a-zA-Z0-9./)
		var val = parseInt($('#pixel-'+row+'-'+col).attr('data-color'));
		if(!val) val=0;
		if(!s[row]) s[row] = {};
		s[row][col]=val;
		bin|=val<<(3*(i%2));
		if(i%2==1){
			res+=encode6BitToChar(bin);
			bin=0;
		}
		i++;
		
		
	});
	console.log(res);
	var json = JSON.stringify({colors:colors,pattern:s});
	$('#load-save').val(json);	
	document.title = $('#title').val() + " - Julekuler generator";
	window.location.hash = '#colors='+JSON.stringify(colors)+';title='+$('#title').val()+';data=' + res;
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

var loadPattern = function(patternstring){
	patternstring = patternstring.split(';');

	var data = '';
	for(var index in patternstring){
		var parameter = patternstring[index].split('=');
		//console.log(parameter);
		if(parameter.length==2){
			if(parameter[0]=='colors'){
				colors = JSON.parse(parameter[1]);

				createColorPicker(colors);			
			}
			if(parameter[0]=='title'){
				document.title=parameter[1]+ ' - Julekuler generator';
				$('#title').val(parameter[1] );		
			}			
			if(parameter[0]=='data'){
				var data = parameter[1];
				
			}
		}
	}

	var i=0;
	var bin=0;
	console.log(data.length);
	//TODO: bad hack... remove in later versions
	oldFormat = false;
	if(data.length==864){
		oldFormat = true;
	}
	if(data){
		traverseDrawingSurface(16,13,function(row,col){
				var $el = $('#pixel-'+row+'-'+col);

				var bin = decode6BitToChar(data.charAt(Math.floor(i/2)));			
				if(i%2==1){
					bin = bin>>3//last three bit
				}else{
					bin = bin&7;//first three bit
				}

				i++;
//TODO: bad hack for old format
				if(oldFormat && (row<=1 || row>=39) && (col==9 || col==6 || col==25 || col==41 || col==57|| col==22 || col==38|| col==54)){
	i--;
	console.log(row,col);
}
				$el.attr('data-color',bin);
				$el.css('background-color',colors[bin]);
			
		
		});
	}
	redraw();
	//if(texture1) texture1.needsUpdate = true;
	
};

var createBookmarkLink=function() {
    var title = document.title;
    var url = document.location.href;
 
    if(window.sidebar && window.sidebar.addPanel){
        /* Mozilla Firefox Bookmark */
        window.sidebar.addPanel(title, url, "");
    }else if(window.external && window.external.AddFavorite){
        /* IE Favorite */
        window.external.AddFavorite(url, title);
    }else if(window.opera && window.print) {
        /* Opera Hotlist */
        alert("Press Control + D to bookmark");
        return true;
    }else{
        /* Other */
        alert("Press Control + D to bookmark");
    }
    return false;
}

var encode6BitToChar = function(bin){
	return encodeMap[bin];
}
var decode6BitToChar = function(bin){
	return decodeMap[bin];
}


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
		return false;
		
	});
	$("#load").click(function(){
		loadPattern($('#load-save').val());

		return false;

	});
	$("#save").click(function(){
		julekuler.saveState();
		return createBookmarkLink();

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
		return false;

	});
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
}


var loadFromUrl = function(){
	var hash=window.location.hash;
	if(hash.length>0) hash = hash.substr(1);
	loadPattern(decodeURIComponent(hash));
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


julekuler.start = function(config){
//TODO config
	
	initThreeJs($('#container'));
	addJulekuler(config.julekuler);
	animateThreeJs();	
	requestAnimationFrame(animateThreeJs);
	createJulekulerCanvas(config.julekulerCanvas);
	createColorPicker(colors);
	
	addEvents();
	loadFromUrl();
	redraw();
	//texture1.needsUpdate = true;
};


julekuler.start({julekulerCanvas:{centerWidth:16,centerHeight:13,sideLength:10}});
window.julekuler = julekuler;








// draw!h




})();
