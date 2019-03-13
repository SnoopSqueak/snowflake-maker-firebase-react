// pretty much all of the code in this file was borrowed (for educational purposes) from http://rectangleworld.com/PaperSnowflake/
import * as stackblur from './stackblur';

//var firebaseui = require('firebaseui');
import firebaseui from 'firebaseui';
import firebase from 'firebase';

//window.addEventListener("load", windowLoadHandler, false);
var bgColors, urlText, urlText2, titleText, user, token;
var provider = new firebase.auth.GoogleAuthProvider();
const stackBlurContextRGBA = stackblur.stackBlurContextRGBA;
const stackBlurContextRGB = stackblur.stackBlurContextRGB;

/*
Dan Gries
rectangleworld.com
Nov 19 2012
Uses Floyd-Steinberg dither algorithm.
*/
// function DitheredLinearGradient(_x0,_y0,_x1,_y1) {
// 	this.x0 = _x0;
// 	this.y0 = _y0;
// 	this.x1 = _x1;
// 	this.y1 = _y1;
// 	this.colorStops = [];
// }
//
// DitheredLinearGradient.prototype.addColorStop = function(ratio,r,g,b) {
// 	if ((ratio < 0) || (ratio > 1)) {
// 		return;
// 	}
// 	var newStop = {ratio:ratio, r:r, g:g, b:b};
// 	if ((ratio >= 0) && (ratio <= 1)) {
// 		if (this.colorStops.length === 0) {
// 			this.colorStops.push(newStop);
// 		}
// 		else {
// 			var i = 0;
// 			var found = false;
// 			var len = this.colorStops.length;
// 			//search for proper place to put stop in order.
// 			while ((!found) && (i<len)) {
// 				found = (ratio <= this.colorStops[i].ratio);
// 				if (!found) {
// 					i++;
// 				}
// 			}
// 			//add stop - remove next one if duplicate ratio
// 			if (!found) {
// 				//place at end
// 				this.colorStops.push(newStop);
// 			}
// 			else {
// 				if (ratio === this.colorStops[i].ratio) {
// 					//replace
// 					this.colorStops.splice(i, 1, newStop);
// 				}
// 				else {
// 					this.colorStops.splice(i, 0, newStop);
// 				}
// 			}
// 		}
// 	}
// }
//
//
// DitheredLinearGradient.prototype.fillRect = function(ctx, rectX0, rectY0, rectW, rectH) {
//
// 	if (this.colorStops.length === 0) {
// 		return;
// 	}
//
// 	var image = ctx.getImageData(rectX0, rectY0, rectW, rectH);
// 	var pixelData = image.data;
// 	var len = pixelData.length;
// 	var nearestValue;
// 	var quantError;
// 	var x;
// 	var y;
//
// 	var vx = this.x1 - this.x0;
// 	var vy = this.y1 - this.y0;
// 	var vMagSquareRecip = 1/(vx*vx+vy*vy);
// 	var ratio;
//
// 	var r,g,b;
// 	var r0,g0,b0,r1,g1,b1;
// 	var ratio0,ratio1;
// 	var f;
// 	var stopNumber;
// 	var found;
// 	var q;
//   var newStop;
//
// 	var rBuffer = [];
// 	var gBuffer = [];
// 	var bBuffer = [];
//
// 	//first complete color stops with 0 and 1 ratios if not already present
// 	if (this.colorStops[0].ratio !== 0) {
// 		newStop = {	ratio:0,
// 						r: this.colorStops[0].r,
// 						g: this.colorStops[0].g,
// 						b: this.colorStops[0].b}
// 		this.colorStops.splice(0,0,newStop);
// 	}
// 	if (this.colorStops[this.colorStops.length-1].ratio !== 1) {
// 		newStop = {	ratio:1,
// 						r: this.colorStops[this.colorStops.length-1].r,
// 						g: this.colorStops[this.colorStops.length-1].g,
// 						b: this.colorStops[this.colorStops.length-1].b}
// 		this.colorStops.push(newStop);
// 	}
//
// 	//create float valued gradient
// 	for (let i = 0; i<len/4; i++) {
//
// 		x = rectX0 + (i % rectW);
// 		y = rectY0 + Math.floor(i/rectW);
//
// 		ratio = (vx*(x - this.x0) + vy*(y - this.y0))*vMagSquareRecip;
// 		if (ratio < 0) {
// 			ratio = 0;
// 		}
// 		else if (ratio > 1) {
// 			ratio = 1;
// 		}
//
// 		//find out what two stops this is between
// 		if (ratio === 1) {
// 			stopNumber = this.colorStops.length-1;
// 		}
// 		else {
// 			stopNumber = 0;
// 			found = false;
// 			while (!found) {
// 				found = (ratio < this.colorStops[stopNumber].ratio);
// 				if (!found) {
// 					stopNumber++;
// 				}
// 			}
// 		}
//
// 		//calculate color.
// 		r0 = this.colorStops[stopNumber-1].r;
// 		g0 = this.colorStops[stopNumber-1].g;
// 		b0 = this.colorStops[stopNumber-1].b;
// 		r1 = this.colorStops[stopNumber].r;
// 		g1 = this.colorStops[stopNumber].g;
// 		b1 = this.colorStops[stopNumber].b;
// 		ratio0 = this.colorStops[stopNumber-1].ratio;
// 		ratio1 = this.colorStops[stopNumber].ratio;
//
// 		f = (ratio-ratio0)/(ratio1-ratio0);
// 		r = r0 + (r1 - r0)*f;
// 		g = g0 + (g1 - g0)*f;
// 		b = b0 + (b1 - b0)*f;
//
// 		//set color as float values in buffer arrays
// 		rBuffer.push(r);
// 		gBuffer.push(g);
// 		bBuffer.push(b);
// 	}
//
// 	//While converting floats to integer valued color values, apply Floyd-Steinberg dither.
// 	for (let i = 0; i<len/4; i++) {
// 		nearestValue = ~~(rBuffer[i]);
// 		quantError =rBuffer[i] - nearestValue;
// 		rBuffer[i+1] += 7/16*quantError;
// 		rBuffer[i-1+rectW] += 3/16*quantError;
// 		rBuffer[i + rectW] += 5/16*quantError;
// 		rBuffer[i+1 + rectW] += 1/16*quantError;
//
// 		nearestValue = ~~(gBuffer[i]);
// 		quantError =gBuffer[i] - nearestValue;
// 		gBuffer[i+1] += 7/16*quantError;
// 		gBuffer[i-1+rectW] += 3/16*quantError;
// 		gBuffer[i + rectW] += 5/16*quantError;
// 		gBuffer[i+1 + rectW] += 1/16*quantError;
//
// 		nearestValue = ~~(bBuffer[i]);
// 		quantError =bBuffer[i] - nearestValue;
// 		bBuffer[i+1] += 7/16*quantError;
// 		bBuffer[i-1+rectW] += 3/16*quantError;
// 		bBuffer[i + rectW] += 5/16*quantError;
// 		bBuffer[i+1 + rectW] += 1/16*quantError;
// 	}
//
// 	//copy to pixel data
// 	for (let i=0; i<len-4*rectW; i += 4) {
// 		q = i/4;
// 		pixelData[i] = ~~rBuffer[q];
// 		pixelData[i+1] = ~~gBuffer[q];
// 		pixelData[i+2] = ~~bBuffer[q];
// 		pixelData[i+3] = 255;
// 	}
//
// 	ctx.putImageData(image,0,0);
//
// }




//for debug messages
function trace(message) {
	try {
		console.log(message);
	}
	catch (exception) {
		return;
	}
}

function windowLoadHandler() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDU4Ng4DN6kd_e2lWrf5-tNwhfs8bnD3KM",
    authDomain: "fir-demo-react.firebaseapp.com",
    databaseURL: "https://fir-demo-react.firebaseio.com",
    projectId: "fir-demo-react",
    storageBucket: "fir-demo-react.appspot.com",
    messagingSenderId: "512547763270"
  };
  firebase.initializeApp(config);

  titleText = document.getElementById("titleText");
  urlText = document.getElementById("urlText");
  urlText2 = document.getElementById("urlText2");
	canvasApp();
}



function canvasApp() {

	// Load the SDK asynchronously
	/*(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "http://connect.facebook.net/en_US/all.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));*/


  //
	// var displayCanvas = document.getElementById("displayCanvas");
	// var displayContext = displayCanvas.getContext("2d");
	// var displayBackgroundCanvas = document.getElementById("displayBackgroundCanvas");
	// var displayBackgroundContext = displayBackgroundCanvas.getContext("2d");
  //
	// var boardCanvas = document.getElementById("boardCanvas");
	// var boardContext = boardCanvas.getContext("2d");
	// var boardBackgroundCanvas = document.getElementById("boardBackgroundCanvas");
	// var boardBackgroundContext = boardBackgroundCanvas.getContext("2d");
	// var polygonLayer = document.getElementById("polygonLayer");
	// var polygonLayerContext = polygonLayer.getContext("2d");
  //
	// var displayWidth = displayCanvas.width;
	// var displayHeight = displayCanvas.height;
	// var boardWidth = boardCanvas.width;
	// var boardHeight = boardCanvas.height;

  //off screen canvas used only when exporting image
	// var exportCanvas = document.createElement('canvas');
	// exportCanvas.width = displayWidth;
	// exportCanvas.height = displayHeight;
	// var exportCanvasContext = exportCanvas.getContext("2d");

	// //off screen canvas
	// var snowflakeShapeCanvas = document.createElement('canvas');
	// snowflakeShapeCanvas.width = displayWidth;
	// snowflakeShapeCanvas.height = displayHeight;
	// var snowflakeShapeContext = snowflakeShapeCanvas.getContext("2d");
  //
	// var bufferCanvas = document.createElement('canvas');
	// bufferCanvas.width = displayWidth;
	// bufferCanvas.height = displayHeight;
	// var bufferContext = bufferCanvas.getContext("2d");

	// //off screen canvas
	// var paperShadingCanvas = document.createElement('canvas');
	// paperShadingCanvas.width = displayWidth;
	// paperShadingCanvas.height = displayHeight;
	// var paperShadingContext = paperShadingCanvas.getContext("2d");

	//For testing:
	//document.body.appendChild(paperShadingCanvas);

	//off screen canvas
	// var shadowCanvas = document.createElement('canvas');
	// shadowCanvas.width = displayWidth;
	// shadowCanvas.height = displayHeight;
	// var shadowContext = shadowCanvas.getContext("2d");

	//gui elements
	var btnMakeSnowflake = document.getElementById("btnMakeSnowflake");
	var btnReset = document.getElementById("btnReset");
	var btnAdd = document.getElementById("btnAdd");
	var btnUndo = document.getElementById("btnUndo");
	var cbAutoUpdate = document.getElementById("cbAutoUpdate");
	var cbShading = document.getElementById("cbShading");
	//var btnShare = document.getElementById("btnShare");
	var btnSave = document.getElementById("btnSave");
  var btnLogIn = document.getElementById("btnLogIn");

	// var drawing;
	// var mouseX;
	// var mouseY;
	//var pmouseX;
	//var pmouseY;
	// var triangleHyp;
	// var snowflakeRadius;
	// var bottomPoint;
	//var boardColor;
	//var boardColor2;
	// var numUndoLevels;
	// var DOT_RAD;
	// var FIRST_DOT_RAD;
	// var dotColor;
	// var firstDotColor;
	// var dots;
	// var polygonLineColor;
	// var history;
	// var historyLength;
	//var dotToDragIndex;
  // const urlColor = "#FFFFFF";

	//var bgColors1;
	//var bgColors2;
	// var gradientBackgroundCanvases;
  //
	// var shadedSnowflakeCurrent;

	//var saveConfirmSeenOnce;

	// Browser-sniffing for CSS gradient vendor prefix
	// from http://stackoverflow.com/questions/15071062/using-javascript-to-edit-css-gradient
	//
	// Detect which browser prefix to use for the specified CSS value
	// (e.g., background-image: -moz-linear-gradient(...);
	//        background-image:   -o-linear-gradient(...); etc).
	//
	// function getCssValuePrefix(name, value) {
	// 	var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
  //
	// 	// Create a temporary DOM object for testing
	// 	var dom = document.createElement('div');
  //
	// 	for (var i = 0; i < prefixes.length; i++) {
	// 		// Attempt to set the style
	// 		dom.style[name] = prefixes[i] + value;
  //
	// 		// Detect if the style was successfully set
	// 		if (dom.style[name]) {
	// 			return prefixes[i];
	// 		}
	// 		dom.style[name] = '';   // Reset the style
	// 	}
	// }
  //
	// var gradientPrefix = getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)');
	// //trace("gradientPrefix " + gradientPrefix);

	init();



	function init() {
		// triangleHyp = 400.0;
		// snowflakeRadius = 200.0;
    //
		// bgColors = [
		// 	{
		// 		name: "blue",
		// 		start: "#586B87",
		// 		end: "#85A0CD"
		// 	},
		// 	{
		// 		name: "green",
		// 		end: "#4ab34e",
		// 		start: "#267028"
		// 	},
		// 	{
		// 		name: "red",
		// 		end: "#ff2F2F",
		// 		start: "#b00000",
		// 		textBG: "#ef1f1f"
		// 	},
		// 	{
		// 		name: "purple",
		// 		end: "#ab6cb3",
		// 		start: "#57305c"
		// 	},
		// 	{
		// 		name: "gold",
		// 		end: "#f4cF57",
		// 		start: "#a47F07",
		// 		textBG: "#d4aF37"
		// 	},
		// 	{
		// 		name: "gray",
		// 		end: "#e0e0e0",
		// 		start: "#707070",
		// 		textBG: "#CCCCCC"
		// 	}
		// ];
    //
		// drawGradientBackgrounds();
		// setBgColor(0);
		// setUpColorButtons();
    //

		// numUndoLevels = 10;
		// DOT_RAD = 6.5;
		// FIRST_DOT_RAD = 10;
		// dotColor = "rgba(255,0,0,0.5)";
		// firstDotColor = "rgba(16,220,0,0.5)";
		// polygonLineColor = "rgba(0,0,0,0.75)";

		//urlColor = "#FFFFFF";

		// drawShading();
		// drawTriangle();
		//drawSnowflake();

		// shadedSnowflakeCurrent = false;

		//var saveConfirmSeenOnce = false;
    //
		// dots = [];
    //
		// history = {};
		// addCurrentBoardToHistory();
		// historyLength = 1;

		setUndoButtonInactive();

		btnMakeSnowflake.addEventListener("click", btnMakeSnowflakeHandler, false);
		//btnUndo.addEventListener("click", btnUndoHandler, false);
		//btnReset.addEventListener("click", btnResetHandler, false);
		//btnAdd.addEventListener("click", btnAddHandler, false);
		cbShading.addEventListener("click", cbShadingListener, false);
		//polygonLayer.addEventListener("mousedown", mouseDownHandler, false);
		btnSave.addEventListener("click", btnSaveListener, false);
    btnLogIn.addEventListener("click", btnLogInListener, false);
		//btnShare.addEventListener("click", btnShareHandler, false);
	}

	function setBgColor(index) {
		//boardColor = bgColors[index].start;
		//boardColor2 = bgColors[index].end;
		paintBackgroundColors(index);
	}
  //
	// function setUpColorButtons() {
	// 	var colorButtonPanel = document.getElementById("colorButtonPanel");
	// 	for (var i = 0; i < bgColors.length; i++) {
	// 		var colorButton = document.createElement("input");
	// 		//Assign different attributes to the element.
	// 		//type="button" class="button1" id="btnUndo" value="undo" title="undo"
	// 		colorButton.setAttribute("type", "button");
	// 		colorButton.setAttribute("value", "");
	// 		colorButton.setAttribute("title", bgColors[i].name);
	// 		colorButton.index = i;
	// 		colorButton.className = "colorButton";
  //
	// 		//colorButton.style.background = bgColors[i].end;
	// 		//colorButton.style.border = "2px solid " + bgColors[i].start;
  //
	// 		colorButton.style.backgroundImage = gradientPrefix + "linear-gradient(" +bgColors[i].start+ ", " +bgColors[i].end+ ")";
	// 		if (!colorButton.style.backgroundImage) {
	// 			trace("gradient button background doesn't work, setting flat color.");
	// 			colorButton.style.background = bgColors[i].end;
	// 		}
	// 		// for IE 6 - 9:
	// 		colorButton.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorStr='" +bgColors[i].start+ "', EndColorStr='" +bgColors[i].end+ "')";
  //
  //
	// 		colorButton.addEventListener("click", colorButtonClickHandler, false);
  //
	// 		colorButtonPanel.appendChild(colorButton);
	// 	}
	// }
  // //
	// function drawGradientBackgrounds() {
	// 	gradientBackgroundCanvases = [];
	// 	for (var i = 0; i < bgColors.length; i++) {
	// 		var gradCanvas = document.createElement('canvas');
	// 		gradCanvas.width = displayWidth;
	// 		gradCanvas.height = displayHeight;
	// 		var gradContext = gradCanvas.getContext("2d");
	// 		var dgrad = new DitheredLinearGradient(-20,-20,-20+460*Math.sin(3*Math.PI/8),-20+460*Math.sin(3*Math.PI/8));
	// 		var col = hexToRgb(bgColors[i].start);
	// 		var col2 = hexToRgb(bgColors[i].end);
	// 		dgrad.addColorStop(0,col2.r,col2.g,col2.b);
	// 		dgrad.addColorStop(1,col.r,col.g,col.b);
	// 		dgrad.fillRect(gradContext,0,0,displayWidth,displayHeight);
	// 		gradientBackgroundCanvases.push(gradCanvas);
	// 	}
	// }
  //
	// function colorButtonClickHandler(evt) {
	// 	//alert(this.index);
	// 	paintBackgroundColors(this.index);
	// }
  // //
	// function paintBackgroundColors(index) {
	// 	drawBoardBackground(index);
	// 	drawDisplayBackground(index);
	// 	titleText.style.background = bgColors[index].start;
	// 	if (!bgColors[index].textBG) {
	// 		urlText.style.background = bgColors[index].end;
	// 	}
	// 	else {
	// 		urlText.style.background = bgColors[index].textBG;
	// 	}
	// 	urlText2.style.background = bgColors[index].start;
	// }

	// function drawBoardBackground(index) {
	// 	boardBackgroundContext.fillStyle = bgColors[index].start;
	// 	boardBackgroundContext.fillRect(0,0,displayWidth,displayHeight);
	// }

	// function drawDisplayBackground(index) {
  //
	// 	//copy from pre-computed canvas
	// 	displayBackgroundContext.drawImage(gradientBackgroundCanvases[index],
	// 							0, 0, displayWidth,displayHeight,
	// 							0, 0, displayWidth,displayHeight);
	// }

	// function setUndoButtonInactive() {
	// 	//btnUndo.style.backgroundColor="#DDD";
	// 	btnUndo.className = "button1_inactive";
	// }
	// function setUndoButtonActive() {
	// 	//btnUndo.style.backgroundColor="#666";
	// 	btnUndo.className = "button1";
	// }

	// function mouseDownHandler(evt) {
	// 	var numDots = dots.length;
	// 	var i;
	// 	var found;
  //   var newDot;
	// 	getMousePosition(evt);
  //
	// 	if (!drawing) {
	// 		//check if mouse down was on an existing dot, and if so set drag behavior
	// 		i = 0;
	// 		found = false;
	// 		while ((!found) && (i < numDots)) {
	// 			 if (dots[i].mouseOverMe()) {
	// 				 found = true;
	// 				 dotToDragIndex = i;
	// 			 }
	// 			 i++;
	// 		}
	// 		if (found) {
	// 			//
	// 			window.addEventListener("mousemove", mouseMoveWhileDragging, false);
	// 			window.addEventListener("mouseup", endDrag, false);
	// 		}
	// 		//otherwise start drawing a new polygon
	// 		else {
	// 			dots = [];
	// 			drawing = true;
	// 			newDot = new Dot(mouseX, mouseY, firstDotColor);
	// 			newDot.rad = FIRST_DOT_RAD;
	// 			dots.push(newDot);
	// 			updatePolygonDrawing();
	// 			window.addEventListener("mousemove", mouseMoveWhileDrawing, false);
	// 		}
	// 	}
	// 	else {
	// 		//check if mouse down was on first dot
	// 		if (dots[0].mouseOverMe() && (dots.length > 2)) {
	// 			closeShape();
	// 		}
	// 		else {
	// 			newDot = new Dot(mouseX, mouseY, dotColor);
	// 			dots.push(newDot);
	// 			updatePolygonDrawing();
	// 			window.addEventListener("mousemove", mouseMoveWhileDrawing, false);
	// 		}
	// 	}
	// }
  //
	// function mouseMoveWhileDragging(evt) {
	// 	evt.stopPropagation();
  //       evt.preventDefault();
	// 	getMousePosition(evt);
	// 	dots[dotToDragIndex].x = mouseX;
	// 	dots[dotToDragIndex].y = mouseY;
	// 	drawClosedPolygon();
	// }

	// function endDrag(evt) {
	// 	//go back to previous state before redrawing polygon
	// 	undo(false);
	// 	drawPolygonToBoard();
	// 	addCurrentBoardToHistory();
  //
	// 	if (cbAutoUpdate.checked) {
	// 		drawSnowflake();
	// 	}
  //
	// 	window.removeEventListener("mousemove", mouseMoveWhileDragging, false);
	// 	window.removeEventListener("mouseup", endDrag, false);
	// }
  //
	// function updatePolygonDrawing() {
	// 	var i;
	// 	var len;
  //
	// 	polygonLayerContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
  //
	// 	len = dots.length;
	// 	//lines
	// 	polygonLayerContext.strokeStyle = polygonLineColor;
	// 	polygonLayerContext.beginPath();
	// 	polygonLayerContext.moveTo(dots[0].x, dots[0].y);
	// 	for (i = 1; i < len; i++) {
	// 		polygonLayerContext.lineTo(dots[i].x, dots[i].y);
	// 	}
	// 	if (dots[0].mouseOverMe() && (dots.length > 1)) {
	// 		//snap
	// 		polygonLayerContext.lineTo(dots[0].x, dots[0].y);
	// 		polygonLayerContext.stroke();
	// 		dots[0].highlight();
	// 	}
	// 	else {
	// 		polygonLayerContext.lineTo(mouseX, mouseY);
	// 		polygonLayerContext.stroke();
	// 	}
  //
	// 	//dots
	// 	for (i = 0; i < len; i++) {
	// 		dots[i].drawMe();
	// 	}
	// }

	// function drawClosedPolygon() {
	// 	var i;
	// 	var len;
  //
	// 	polygonLayerContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
  //
	// 	len = dots.length;
	// 	//lines
	// 	polygonLayerContext.strokeStyle = polygonLineColor;
	// 	polygonLayerContext.beginPath();
	// 	polygonLayerContext.moveTo(dots[0].x, dots[0].y);
	// 	for (i = 1; i < len; i++) {
	// 		polygonLayerContext.lineTo(dots[i].x, dots[i].y);
	// 	}
	// 	polygonLayerContext.lineTo(dots[0].x, dots[0].y);
	// 	polygonLayerContext.stroke();
  //
	// 	//dots
	// 	for (i = 0; i < len; i++) {
	// 		dots[i].drawMe();
	// 	}
	// }

	// function closeShape() {
	// 	drawing = false;
	// 	window.removeEventListener("mousemove", mouseMoveWhileDrawing, false);
	// 	drawClosedPolygon();
	// 	//draw polygon to board layer
	// 	drawPolygonToBoard();
	// 	//store history
	// 	addCurrentBoardToHistory();
  //
	// 	shadedSnowflakeCurrent = false;
	// 	if (cbAutoUpdate.checked) {
	// 		drawSnowflake();
	// 	}
	// }
  //
	// function cancelDrawing() {
	// 	polygonLayerContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
	// 	dots = [];
	// 	drawing = false;
	// 	window.removeEventListener("mousemove", mouseMoveWhileDrawing, false);
	// }
  //
	// function btnAddHandler(evt) {
	// 	cancelDrawing();
	// }

	// function addCurrentBoardToHistory() {
	// 	setUndoButtonActive();
  //
	// 	var historyCanvas = document.createElement('canvas');
	// 	historyCanvas.width = boardWidth;
	// 	historyCanvas.height = boardHeight;
	// 	var historyContext = historyCanvas.getContext("2d");
  //
	// 	//copy current to history
	// 	historyContext.drawImage(boardCanvas,
	// 							0, 0, boardWidth, boardHeight,
	// 							0, 0, boardWidth, boardHeight);
  //
	// 	//put in history list, shorten history if necessary
	// 	if (history.first == null) {
	// 		history.first = historyContext;
	// 		history.last = historyContext;
	// 		historyLength = 1;
	// 	}
	// 	else {
	// 		historyContext.next = history.first;
	// 		history.first.prev = historyContext;
	// 		history.first = historyContext;
	// 		historyLength++;
	// 	}
	// 	if (historyLength > numUndoLevels + 1) {
	// 		history.last.canvas = null;
	// 		history.last.prev.next = null; //(will it be garbage collected?)
	// 		history.last = history.last.prev;
	// 		historyLength = numUndoLevels + 1;
	// 	}
	// }

	// function btnUndoHandler(evt) {
	// 	undo(true);
	// 	dots = [];
	// }

	// function undo(clearDrawingBoard) {
	// 	if (clearDrawingBoard) {
	// 		//first clear board of any active lines
	// 		polygonLayerContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
	// 	}
  //
	// 	if (drawing) {
	// 		cancelDrawing();
	// 		return;
	// 	}
	// 	if (historyLength === 1) {
	// 		//this means the board still has a blank triangle
	// 		return;
	// 	}
  //
	// 	//first history state will be copy of current so remove it
	// 	//history.first.canvas = null;
	// 	history.first.canvas.getContext('2d').clearRect(0, 0, history.first.canvas.width, history.first.canvas.height);
	// 	history.first.next.prev = null;
	// 	history.first = history.first.next;
	// 	historyLength--;
	// 	boardContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
	// 	boardContext.drawImage(history.first.canvas,
	// 							0, 0, boardWidth, boardHeight,
	// 							0, 0, boardWidth, boardHeight);
	// 	if (historyLength === 1) {
	// 		setUndoButtonInactive();
	// 	}
  //
	// 	if (cbAutoUpdate.checked) {
	// 		drawSnowflake();
	// 	}
  //
	// 	shadedSnowflakeCurrent = false;
	// }

	// function btnResetHandler(evt) {
	// 	if (window.confirm('Do you really want to erase everything and start over?')) {
	// 		if (drawing) {
	// 			cancelDrawing();
	// 		}
	// 		dots = [];
	// 		drawing = false;
	// 		clearHistory();
	// 		clearDisplay();
	// 		drawTriangle();
	// 		addCurrentBoardToHistory();
	// 		polygonLayerContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
	// 		shadedSnowflakeCurrent = false;
	// 	}
	// }
  //
	// function clearDisplay() {
	// 	displayContext.clearRect(-1,-1,displayWidth+2,displayHeight+2);
	// }

	// function clearHistory() {
	// 	while (historyLength > 0) {
	// 		//history.first.canvas = null;
	// 		history.first.canvas.getContext('2d').clearRect(0, 0, history.first.canvas.width, history.first.canvas.height);
	// 		if (historyLength > 1) {
	// 			history.first.next.prev = null;
	// 			history.first = history.first.next;
	// 		}
	// 		else {
	// 			history.first = null;
	// 		}
	// 		historyLength--;
	// 	}
	// 	setUndoButtonInactive();
	// }
  //
	// function drawPolygonToBoard() {
	// 	var i;
	// 	var len = dots.length;
	// 	boardContext.fillStyle = "#000000";
	// 	boardContext.beginPath();
	// 	boardContext.moveTo(dots[0].x, dots[0].y);
	// 	for (i = 1; i < len; i++) {
	// 		boardContext.lineTo(dots[i].x, dots[i].y);
	// 	}
	// 	boardContext.lineTo(dots[0].x, dots[0].y);
	// 	boardContext.fill();
	// 	redToAlphaFilter(boardContext);
	// }

	// function mouseMoveWhileDrawing(evt) {
	// 	evt.stopPropagation();
  //       evt.preventDefault();
	// 	getMousePosition(evt);
	// 	updatePolygonDrawing();
	// }

	// function getMousePosition(evt) {
	// 	var bRect = boardCanvas.getBoundingClientRect();
	// 	mouseX = (evt.clientX - bRect.left)*(boardCanvas.width/bRect.width);
	// 	mouseY = (evt.clientY - bRect.top)*(boardCanvas.height/bRect.height);
	// }

	// function Dot(_x,_y, _col) {
	// 	this.x = _x;
	// 	this.y = _y;
	// 	this.rad = DOT_RAD;
	// 	this.color = _col;
	// }
  //
	// Dot.prototype.drawMe = function() {
	// 	polygonLayerContext.fillStyle = this.color;
	// 	polygonLayerContext.beginPath();
	// 	polygonLayerContext.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
	// 	polygonLayerContext.closePath();
	// 	polygonLayerContext.fill();
	// }
  //
	// Dot.prototype.highlight = function() {
	// 	polygonLayerContext.strokeStyle = this.color;
	// 	polygonLayerContext.beginPath();
	// 	polygonLayerContext.arc(this.x, this.y, this.rad+2, 0, 2*Math.PI, false);
	// 	polygonLayerContext.closePath();
	// 	polygonLayerContext.stroke();
	// }
  //
	// Dot.prototype.mouseOverMe = function() {
	// 	var dx = this.x - mouseX;
	// 	var dy = this.y - mouseY;
	// 	return (dx*dx+dy*dy < this.rad*this.rad);
	// }

	// function drawTriangle() {
	// 	boardContext.clearRect(-1,-1,boardCanvas.width+2, boardCanvas.height+2);
	// 	bottomPoint = {x: Math.floor(boardCanvas.width/2), y: boardCanvas.height - 20};
	// 	var longLeg = triangleHyp*Math.sqrt(3)/2;
	// 	boardContext.fillStyle = "#FFFFFF";
	// 	boardContext.strokeStyle = "#FFFFFF";
	// 	boardContext.beginPath();
	// 	boardContext.moveTo(bottomPoint.x, bottomPoint.y);
	// 	boardContext.lineTo(bottomPoint.x - triangleHyp*Math.sin(Math.PI/12),
	// 						bottomPoint.y - triangleHyp*Math.cos(Math.PI/12));
	// 	boardContext.lineTo(bottomPoint.x + longLeg*Math.sin(Math.PI/12),
	// 						bottomPoint.y - longLeg*Math.cos(Math.PI/12));
	// 	boardContext.lineTo(bottomPoint.x, bottomPoint.y);
	// 	boardContext.stroke();
	// 	boardContext.fill();
	// }

	function btnMakeSnowflakeHandler(evt) {
		drawSnowflake();
	}

	// function drawSnowflake() {
	// 	var scale = snowflakeRadius/triangleHyp;
  //
	// 	//first draw to buffer
	// 	snowflakeShapeContext.clearRect(-1,-1,snowflakeShapeCanvas.width+2,snowflakeShapeCanvas.height+2);
	// 	for (var i = 0; i < 6; i++) {
	// 		snowflakeShapeContext.save();
	// 		snowflakeShapeContext.translate(displayCanvas.width/2, displayCanvas.height/2);
	// 		snowflakeShapeContext.scale(scale, scale);
  //
	// 		snowflakeShapeContext.save();
	// 		snowflakeShapeContext.rotate(i*Math.PI/3 + Math.PI/12);
	// 		snowflakeShapeContext.translate(-bottomPoint.x, -bottomPoint.y);
	// 		snowflakeShapeContext.drawImage(boardCanvas,
	// 								0, 0, boardCanvas.width, boardCanvas.height,
	// 								0, 0, boardCanvas.width, boardCanvas.height);
  //
	// 		snowflakeShapeContext.restore();
	// 		snowflakeShapeContext.scale(-1, 1);
	// 		snowflakeShapeContext.rotate(i*Math.PI/3 + Math.PI/12);
	// 		snowflakeShapeContext.translate(-bottomPoint.x, -bottomPoint.y);
	// 		snowflakeShapeContext.drawImage(boardCanvas,
	// 								0, 0, boardCanvas.width, boardCanvas.height,
	// 								0, 0, boardCanvas.width, boardCanvas.height);
	// 		snowflakeShapeContext.restore();
	// 	}
  //
  //
	// 	clearDisplay();
  //
	// 	//make shadow
	// 	makeShadow(snowflakeShapeContext, shadowContext);
	// 	//draw shadow to display
	// 	displayContext.drawImage(shadowCanvas,
	// 								0, 0, displayWidth, displayHeight,
	// 								0, 0, displayWidth, displayHeight);
  //
	// 	//draw paper shading to buffer
	// 	if (cbShading.checked) {
	// 		drawShadedSnowflakeToBuffer();
	// 		displayContext.drawImage(bufferCanvas,
	// 									0, 0, displayWidth, displayHeight,
	// 									0, 0, displayWidth, displayHeight);
	// 		shadedSnowflakeCurrent = true;
	// 	}
	// 	else {
	// 		displayContext.drawImage(snowflakeShapeCanvas,
	// 									0, 0, displayWidth, displayHeight,
	// 									0, 0, displayWidth, displayHeight);
	// 		shadedSnowflakeCurrent = false;
	// 	}
	// }

	// function drawShadedSnowflakeToBuffer() {
	// 		bufferContext.drawImage(paperShadingCanvas,
	// 									0, 0, displayWidth, displayHeight,
	// 									0, 0, displayWidth, displayHeight);
	// 		transferAlpha(snowflakeShapeContext, bufferContext);
	// }

	// function cbShadingListener(evt) {
	// 	if (cbShading.checked) {
	// 		if (!shadedSnowflakeCurrent) {
	// 			drawShadedSnowflakeToBuffer();
	// 			makeShadow(snowflakeShapeContext, shadowContext);
	// 			shadedSnowflakeCurrent = true;
	// 		}
	// 		clearDisplay();
	// 		displayContext.drawImage(shadowCanvas,
	// 								0, 0, displayWidth, displayHeight,
	// 								0, 0, displayWidth, displayHeight);
	// 		displayContext.drawImage(bufferCanvas,
	// 									0, 0, displayWidth, displayHeight,
	// 									0, 0, displayWidth, displayHeight);
	// 	}
	// 	else {
	// 		clearDisplay();
	// 		displayContext.drawImage(shadowCanvas,
	// 								0, 0, displayWidth, displayHeight,
	// 								0, 0, displayWidth, displayHeight);
	// 		displayContext.drawImage(snowflakeShapeCanvas,
	// 									0, 0, displayWidth, displayHeight,
	// 									0, 0, displayWidth, displayHeight);
	// 	}
	// }

	// function makeShadow(sourceContext, destContext) { //manually created shadow for consistent cross-browser performance
	// 	var shadowR = 0;
	// 	var shadowG = 0;
	// 	var shadowB = 0;
	// 	var shadowA = 0.15;
	// 	var shadowOffsetX = 6;
	// 	var shadowOffsetY = 6;
	// 	var shadowBlur = 4;
	// 	var sourceCanvas = sourceContext.canvas;
	// 	var destCanvas = destContext.canvas;
  //
	// 	destContext.clearRect(0,0,destCanvas.width,destCanvas.height);
  //
	// 	destContext.drawImage(sourceCanvas,
	// 							0, 0, sourceCanvas.width, sourceCanvas.height,
	// 							shadowOffsetX, shadowOffsetY, sourceCanvas.width, sourceCanvas.height);
  //
	// 	//Filter: change color to shadow color, multiply alpha by shadow alpha factor
	// 	var imageData = destContext.getImageData(0, 0, destCanvas.width, destCanvas.height);
	// 	var pixelData = imageData.data;
	// 	var len = pixelData.length;
	// 	var i;
	// 	for (i = 0; i < len; i += 4) {
	// 		if (pixelData[i+3] !== 0) {
	// 			pixelData[i] = shadowR;
	// 			pixelData[i+1] = shadowG;
	// 			pixelData[i+2] = shadowB;
	// 			pixelData[i+3] *= shadowA;
	// 		}
	// 	}
	// 	destContext.putImageData(imageData, 0, 0);
  //
	// 	//blur
	// 	stackBlurContextRGBA(destContext, 0, 0, destCanvas.width, destCanvas.height, shadowBlur);
	// }
  //
	// function drawShading() {
	// 	//var grays = [255,220,194,244,191,240,190,146,240,187,240,170];
	// 	var grays = [255,242,234,250,233,249,232,217,249,232,249,234];
	// 	var sideLength = snowflakeRadius + 2;
	// 	var phase = -Math.PI/2;
	// 	var angleInc = Math.PI/6;
	// 	paperShadingContext.fillStyle = "#FFFFFF";
	// 	paperShadingContext.fillRect(0,0,displayWidth,displayHeight);
	// 	paperShadingContext.save();
	// 	paperShadingContext.translate(displayWidth/2, displayHeight/2);
	// 	for (var i = 0; i < 12; i++) {
	// 		paperShadingContext.beginPath();
	// 		paperShadingContext.moveTo(0,0);
	// 		paperShadingContext.fillStyle = gray(grays[i]);
	// 		paperShadingContext.lineTo(sideLength*Math.cos(phase + i*angleInc), sideLength*Math.sin(phase + i*angleInc));
	// 		paperShadingContext.lineTo(sideLength*Math.cos(phase + (i+1)*angleInc), sideLength*Math.sin(phase + (i+1)*angleInc));
	// 		paperShadingContext.lineTo(0,0);
	// 		paperShadingContext.fill();
	// 	}
	// 	paperShadingContext.restore();
  //
	// 	applyGrayNoise(paperShadingContext,4);
	// 	stackBlurContextRGB(paperShadingContext, 0, 0, displayWidth, displayWidth, 1.5);
	// 	applyGrayNoise(paperShadingContext,2);
	// }

	// function applyGrayNoise(ctx, amt) {
	// 	var canvas = ctx.canvas;
	// 	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// 	var pixelData = imageData.data;
	// 	var len = pixelData.length;
	// 	var i;
	// 	var val;
	// 	for (i = 0; i < len; i += 4) {
	// 		val = pixelData[i];
	// 		val = val + (1-2*Math.random())*amt;
	// 		val = Math.floor(val + 0.5);
	// 		val = (val < 0) ? 0 : ((val > 255) ? 255 : val);
	// 		pixelData[i] = val;
	// 		pixelData[i+1] = val;
	// 		pixelData[i+2] = val;
	// 	}
	// 	ctx.putImageData(imageData, 0, 0);
	// }

	// function gray(value) {
	// 	return "rgb(" + value + "," + value + "," + value + ")";
	// }

	// function redToAlphaFilter(ctx) {
	// 	var canvas = ctx.canvas;
	// 	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// 	var pixelData = imageData.data;
	// 	var len = pixelData.length;
	// 	var i;
	// 	for (i = 0; i < len; i += 4) {
	// 		pixelData[i+3] *= pixelData[i]/255.0;
	// 		//make white at same time
	// 		if (pixelData[i] !== 255) {
	// 			pixelData[i] = 255;
	// 			pixelData[i+1] = 255;
	// 			pixelData[i+2] = 255;
	// 		}
  //
	// 	}
	// 	ctx.putImageData(imageData, 0, 0);
	// }

	// function transferAlpha(sourceContext, destContext) {
	// 	//will only work if contexts come from same-sized canvases.
	// 	var sourceCanvas = sourceContext.canvas;
	// 	var sourceImageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
	// 	var sourcePixelData = sourceImageData.data;
	// 	var len = sourcePixelData.length;
	// 	var destImageData = destContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
	// 	var destPixelData = destImageData.data;
	// 	var i;
	// 	for (i = 3; i < len; i += 4) {
	// 		destPixelData[i] = sourcePixelData[i];
	// 	}
	// 	destContext.putImageData(destImageData, 0, 0);
	// }

  // function drawExportCanvas() {
	// 	//draw elements
	// 	exportCanvasContext.drawImage(displayBackgroundCanvas, 0,0,displayWidth,displayHeight,0,0,displayWidth,displayHeight);
	// 	exportCanvasContext.drawImage(displayCanvas, 0,0,displayWidth,displayHeight,0,0,displayWidth,displayHeight);
  //
	// 	//add printed url to image
	// 	exportCanvasContext.fillStyle = urlColor;
	// 	exportCanvasContext.font = 'bold italic 10px Helvetica, Arial, sans-serif';
	// 	exportCanvasContext.textBaseline = "top";
	// 	var caption = "Made with the paper snowflake maker at www.rectangleworld.com";
	// 	var metrics = exportCanvasContext.measureText(caption);
	// 	exportCanvasContext.fillText(caption, displayWidth - metrics.width - 20, displayHeight);
	// }

	// function btnSaveListener(evt) {
	// 	drawExportCanvas();
  //   // click to save
  //   var dataURL = exportCanvas.toDataURL("image/png");
  //   var link = document.createElement("a");
  //   link.setAttribute("href", dataURL);
  //   link.setAttribute("download", "snowflake");
  //   link.click();
  //   return;
  //
	// 	//we will open a new window with the image contained within:
	// 	//retrieve canvas image as data URL:
	// 	var dataURL = exportCanvas.toDataURL("image/png");
	// 	//open a new window of appropriate size to hold the image:
	// 	var windowW = Math.max(exportCanvas.width,500);
	// 	var windowH = Math.max(exportCanvas.height + 50,500);
	// 	var imageWindow = window.open("", "snowflakeImage", "left=0,top=0,width="+windowW+",height="+windowH+",toolbar=0,resizable=0");
	// 	//write some html into the new window, creating an empty image:
	// 	imageWindow.document.write("<html><head><title>Export Image</title></head><body>")
	// 	imageWindow.document.write('<p style="font-family: sans-serif; color:#333333; font-size: 10px">Right-click (Win) or control-click (Mac) and select "save image as..." to save this image in PNG format.</p>');
	// 	imageWindow.document.write("<br/>");
	// 	imageWindow.document.write("<img id='exportImage'" +
	// 								" alt='snowflake image'" +
	// 								" height='" + displayHeight + "px'" +
	// 								" width='"  + displayWidth  + "px'" +
	// 								" style='width:" + displayWidth + "px;" +
	// 								"height:" + displayHeight + "px;position:relative; display:block; margin:auto;'/>");
	// 	imageWindow.document.write("</body></html>");
	// 	imageWindow.document.close();
	// 	//copy the image into the empty img in the newly opened window:
	// 	var exportImage = imageWindow.document.getElementById("exportImage");
	// 	exportImage.src = dataURL;
	// }

  function btnLogInListener (evt) {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...

    });
  }

	//function below from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	// function hexToRgb(hex) {
	// 	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	// 	return result ? {
	// 		r: parseInt(result[1], 16),
	// 		g: parseInt(result[2], 16),
	// 		b: parseInt(result[3], 16)
	// 	} : null;
	// }

}

const Controls = { windowLoadHandler: windowLoadHandler };
export default Controls;
