/**
 * Created by wassi on 26.11.13.
 */
angular.module('kpg.service.render.threejs', [])
    .factory('buildStuff', function () {



// set up the sphere vars
        var radius = 50,
            segments = 64,
            rings = 41;
        var defaults = {
            canvas:{
                segments:20,
                rings:14
            },
            webgl:{
                segments:64,
                rings:41
            },
            frame:{
                width:400,
                height:400,
                background:0x333F47
            },
            camera:{

                viewAngle:45,
                near:0.1,
                far:10000,
                x:0,
                y:0,
                z:300
            },
            sphere:{
                radius:50,
                x:0,
                y:0,
                z:0
            },
            textureField:{
                source:{
                    width:10,
                    height:10
                },
                target:{
                    width:10,
                    height:10
                },
                delta:{
                    x:0,
                    y:0
                }
            },
            texture:{
                width:300,
                height:300
            },
            useCanvas:true,
            patternService:patternSerice//TODO: DI
        };
        defaults.camera.aspect = defaults.camera.height/defaults.camera.width;





        return function(config){

            config = angular.extend(config||{},defaults);

            var glCanvas = document.createElement("canvas");
            var glContext = glCanvas.getContext("webgl");
            var drawingCanvas = document.createElement("canvas");
            var drawingContext = drawingCanvas.getContext("2d");
            var textureCanvas = document.createElement("canvas");
            var textureContext = textureCanvas.getContext("2d");
            var colorCanvas = document.createElement("canvas");
            var colorContext = colorCanvas.getContext("2d");
            var spriteCanvas = document.createCanvas("Canvas");
            var spriteContext = spriteCanvas.getContext("2d");

            glCanvas.width=config.frame.width;
            glCanvas.height=config.frame.width;
            drawingCanvas.width = config.texture.width;
            drawingCanvas.height = config.texture.height;
            textureCanvas.width = config.texture.width;
            textureCanvas.height = config.texture.height;
            colorCanvas.width = config.textureField.source.width;
            colorCanvas.height = config.textureField.source.height;
            spriteCanvas.width = config.textureField.source.width;
            spriteCanvas.height = config.textureField.source.height;


            //initialize ThreeD renderer
            var renderer;
            var geometry = config.webgl;
            //var useCanvas = Modernizr.webgl && gl;//done in controller
            if (config.useCanvas) {
                renderer = new THREE.WebGLRenderer();
                geometry = config.canvas;
            } else {
                renderer = new THREE.CanvasRenderer();
            }

            var camera = new THREE.PerspectiveCamera(
                config.camera.viewAngle,
                config.camera.aspect,
                config.camera.near,
                config.camera.far);


            renderer.setClearColorHex(config.frame.background, 1);

            var scene = new THREE.Scene();

            //add the camera to the scene
            scene.add(camera);
            // CONTROLS

            //the camera starts at 0,0,0
            //so pull it back
            camera.position.z = config.camera.z;

            //start the renderer
            renderer.setSize(config.frame.width, config.frame.height);

            var controls = new THREE.OrbitControls(camera, renderer.domElement);


            //attach the render-supplied DOM element


            imgObj.src = 'images/bg.png';
            imgObj.onload = function () {
                woolCanvas.getContext('2d').drawImage(imgObj, 0, 0, 125, 150, 0, 0, woolCanvas.width, woolCanvas.height);
                redraw();
            }

            //Create texture canvas

            var julekulerTexture = new THREE.Texture(textureCanvas);
            var material1 = new THREE.MeshLambertMaterial({map: julekulerTexture});
            var mesh1 = new THREE.Mesh(
                new THREE.SphereGeometry(
                    config.sphere.radius,
                    geometry.segments,
                    geometry.rings),
                material1
            );
            // changes to the vertices

            scene.add(mesh1);
            scene.needsUpdate = true;
            mesh1.geometry.verticesNeedUpdate = true;
            mesh1.geometry.normalsNeedUpdate = true;

            var ambientLight = new THREE.AmbientLight(0xffffff);
            scene.add(ambientLight);
            /*var directionalLight = new THREE.DirectionalLight(0xffffff);
             directionalLight.position.set(1, 1, 1).normalize();
             scene.add(directionalLight);*/
            renderer.render(scene, camera);

            var animateThreeJs = function () {

                // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
                requestAnimationFrame(animateThreeJs);

                // Render the scene.
                renderer.render(scene, camera);
                controls.update();
            };
            animateThreeJs();
//TODO: prepare colormeshes and register listeners for increased performance

            var redraw = function (config,modelService) {
                config=angular.extend(config||{},defaults);

                var a = config.textureField.target.width;

                drawingContext.fillStyle = '#fff';
                drawingContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                var lastcol = null;
                patternService.traversePattern(function (row, col) {
                    var c = modelService.getColorAt(row,col);
                    if (typeof c === 'undefined') c = 0;
                    if (c != lastcol) {
                        //TODO: prepare colorContexts!
                        //determine color
                        colorContext.fillStyle = modelService.colors[c];
                        colorContext.fillRect(0, 0, 1, 1);
                        var myCol = colorContext.getImageData(0, 0, 1, 1);
                        colorContext.clearRect(0, 0, colorCanvas.width, colorCanvas.height);

                        var pixels = spriteContext.getImageData(0, 0, spriteCanvas.width, spriteCanvas.height);
                        for (var i = 0; i < pixels.data.length; i++) {
                            pixels.data[i] = pixels.data[i] / 255.0 * myCol.data[i % 4];

                        }
                        colorContext.putImageData(pixels, 0, 0);
                    }

                    lastcol = c;

                    drawingContext.drawImage(colorCanvas,
                        0, 0,
                        colorCanvas.width, colorCanvas.height,
                        a * col + config.textureField.delta.x, a * row + config.textureField.delta.y,

                        config.textureField.target.width, config.textureField.target.height);

                });

                //copy over created image
                //TODO: make configurable without dependencies...
                textureContext.drawImage(drawingCanvas, 0, 0);
                for (var i = 0; i < 7; i++) {
                    for (var j = 0; j < 4; j++) {
                        var fromx = j * 16 * a + (16 / 2 - (i + 1)) * a;
                        var fromy = i * 2 * a;
                        var fromwidth = (i + 1) * 2 * a;
                        var fromheight = 2 * a;
                        var tox = j * 16 * a;
                        var toy = i * 2 * a;
                        var towidth = 16 * a;
                        var toheight = 2 * a;
                        console.log(fromx, fromy, fromwidth, fromheight, tox, toy, towidth, toheight);
                        textureContext.drawImage(canvas, fromx, fromy, fromwidth, fromheight, tox, toy, towidth, toheight);
                        textureContext.drawImage(canvas, fromx, 41 * a - fromy - 2 * a, fromwidth, fromheight, tox, 41 * a - toy - 2 * a, towidth, toheight);
                    }

                }
                julekulerTexture.needsUpdate = true;
                scene.needsUpdate = true;


            };

            return {
                /**
                 * return the renderer to attach it to dom
                 */
                renderer:renderer.domElement,
                redraw: redraw
            }
        };


});
