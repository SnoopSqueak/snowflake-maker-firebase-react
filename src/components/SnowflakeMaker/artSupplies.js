import * as stackblur from './stackblur';

export default (() => {
  const instance = {};
  const grays = [255,242,234,250,233,249,232,217,249,232,249,234];
  instance.dotColor = "rgba(255,0,0,0.5)";
  instance.firstDotColor = "rgba(16,220,0,0.5)";
  instance.autoUpdate = false;
  const polygonLineColor = "rgba(0,0,0,0.75)";
  instance.history = {};
  instance.historyLength = 0;
  instance.numUndoLevels = 50;
  instance.triangleHyp = 400.0;
  instance.snowflakeRadius = 200.0;
  instance.shading = false;
  instance.urlColor = "#FFFFFF";

  instance.getCssValuePrefix = function (name, value) {
    var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++) {
      // Attempt to set the style
      dom.style[name] = prefixes[i] + value;

      // Detect if the style was successfully set
      if (dom.style[name]) {
        return prefixes[i];
      }
      dom.style[name] = '';   // Reset the style
    }
  }
  instance.gradientPrefix = instance.getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)');

  instance.gray = function (value) {
    return "rgb(" + value + "," + value + "," + value + ")";
  };

  instance.applyGrayNoise = function (ctx, amt) {
    var canvas = ctx.canvas;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixelData = imageData.data;
    var len = pixelData.length;
    var i;
    var val;
    for (i = 0; i < len; i += 4) {
      val = pixelData[i];
      val = val + (1-2*Math.random())*amt;
      val = Math.floor(val + 0.5);
      val = (val < 0) ? 0 : ((val > 255) ? 255 : val);
      pixelData[i] = val;
      pixelData[i+1] = val;
      pixelData[i+2] = val;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  instance.drawShading = function (ctx, sideLength, phase, angleInc, width, height) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width/2, height/2);
    for (var i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.fillStyle = instance.gray(grays[i]);
      ctx.lineTo(sideLength*Math.cos(phase + i*angleInc), sideLength*Math.sin(phase + i*angleInc));
      ctx.lineTo(sideLength*Math.cos(phase + (i+1)*angleInc), sideLength*Math.sin(phase + (i+1)*angleInc));
      ctx.lineTo(0,0);
      ctx.fill();
    }
    ctx.restore();

    instance.applyGrayNoise(ctx, 4);
    stackblur.stackBlurContextRGB(ctx, 0, 0, width, width, 1.5);
    instance.applyGrayNoise(ctx, 2);
  }

  instance.drawTriangle = function (ctx, bottomPoint) {
    let longLeg = instance.triangleHyp*Math.sqrt(3)/2;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(bottomPoint.x, bottomPoint.y);
    ctx.lineTo(bottomPoint.x - instance.triangleHyp*Math.sin(Math.PI/12),
              bottomPoint.y - instance.triangleHyp*Math.cos(Math.PI/12));
    ctx.lineTo(bottomPoint.x + longLeg*Math.sin(Math.PI/12),
              bottomPoint.y - longLeg*Math.cos(Math.PI/12));
    ctx.lineTo(bottomPoint.x, bottomPoint.y);
    ctx.stroke();
    ctx.fill();
  }

  instance.makeShadow = function (sourceContext, destContext) { //manually created shadow for consistent cross-browser performance
		var shadowR = 0;
		var shadowG = 0;
		var shadowB = 0;
		var shadowA = 0.15;
		var shadowOffsetX = 6;
		var shadowOffsetY = 6;
		var shadowBlur = 4;
		var sourceCanvas = sourceContext.canvas;
		var destCanvas = destContext.canvas;

		destContext.clearRect(0,0,destCanvas.width,destCanvas.height);

		destContext.drawImage(sourceCanvas,
								0, 0, sourceCanvas.width, sourceCanvas.height,
								shadowOffsetX, shadowOffsetY, sourceCanvas.width, sourceCanvas.height);

		//Filter: change color to shadow color, multiply alpha by shadow alpha factor
		var imageData = destContext.getImageData(0, 0, destCanvas.width, destCanvas.height);
		var pixelData = imageData.data;
		var len = pixelData.length;
		var i;
		for (i = 0; i < len; i += 4) {
			if (pixelData[i+3] !== 0) {
				pixelData[i] = shadowR;
				pixelData[i+1] = shadowG;
				pixelData[i+2] = shadowB;
				pixelData[i+3] *= shadowA;
			}
		}
		destContext.putImageData(imageData, 0, 0);

		//blur
		stackblur.stackBlurContextRGBA(destContext, 0, 0, destCanvas.width, destCanvas.height, shadowBlur);
	}

  instance.drawShadedSnowflakeToBuffer = function (shadingCanvas, bufferContext, snowflakeContext) {
      bufferContext.drawImage(shadingCanvas,
                    0, 0, shadingCanvas.width, shadingCanvas.height,
                    0, 0, shadingCanvas.width, shadingCanvas.height);
      instance.transferAlpha(snowflakeContext, bufferContext);
  }

  instance.transferAlpha = function (sourceContext, destContext) {
    //will only work if contexts come from same-sized canvases.
    var sourceCanvas = sourceContext.canvas;
    var sourceImageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    var sourcePixelData = sourceImageData.data;
    var len = sourcePixelData.length;
    var destImageData = destContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    var destPixelData = destImageData.data;
    var i;
    for (i = 3; i < len; i += 4) {
      destPixelData[i] = sourcePixelData[i];
    }
    destContext.putImageData(destImageData, 0, 0);
  }

  instance.drawSnowflake = function (boardCanvas, displayCanvas, offScreenCanvases) {
    let snowflakeCanvas = offScreenCanvases["snowflake"];
    let shadingCanvas = offScreenCanvases["shading"];
    let bufferCanvas = offScreenCanvases["buffer"];
    let shadowCanvas = offScreenCanvases["shadow"];

		var scale = instance.snowflakeRadius/instance.triangleHyp;
    let bottomPoint = {x: Math.floor(boardCanvas.width/2), y: boardCanvas.height - 20};
		//first draw to buffer
    let snowflakeShapeContext = snowflakeCanvas.getContext('2d');
		snowflakeShapeContext.clearRect(-1,-1,snowflakeCanvas.width+2,snowflakeCanvas.height+2);
		for (var i = 0; i < 6; i++) {
			snowflakeShapeContext.save();
			snowflakeShapeContext.translate(displayCanvas.width/2, displayCanvas.height/2);
			snowflakeShapeContext.scale(scale, scale);

			snowflakeShapeContext.save();
			snowflakeShapeContext.rotate(i*Math.PI/3 + Math.PI/12);
			snowflakeShapeContext.translate(-bottomPoint.x, -bottomPoint.y);
			snowflakeShapeContext.drawImage(boardCanvas,
									0, 0, boardCanvas.width, boardCanvas.height,
									0, 0, boardCanvas.width, boardCanvas.height);

			snowflakeShapeContext.restore();
			snowflakeShapeContext.scale(-1, 1);
			snowflakeShapeContext.rotate(i*Math.PI/3 + Math.PI/12);
			snowflakeShapeContext.translate(-bottomPoint.x, -bottomPoint.y);
			snowflakeShapeContext.drawImage(boardCanvas,
									0, 0, boardCanvas.width, boardCanvas.height,
									0, 0, boardCanvas.width, boardCanvas.height);
			snowflakeShapeContext.restore();
		}


		//clearDisplay();
    let displayContext = displayCanvas.getContext('2d');
    displayContext.clearRect(-1,-1,displayCanvas.width+2,displayCanvas.height+2);

		//make shadow
		instance.makeShadow(snowflakeShapeContext, shadowCanvas.getContext('2d'));
		//draw shadow to display
		displayContext.drawImage(shadowCanvas,
									0, 0, displayCanvas.width, displayCanvas.height,
									0, 0, displayCanvas.width, displayCanvas.height);

		//draw paper shading to buffer
		if (instance.shading) {
			instance.drawShadedSnowflakeToBuffer(shadingCanvas, bufferCanvas.getContext('2d'), snowflakeShapeContext);
			displayContext.drawImage(bufferCanvas,
										0, 0, displayCanvas.width, displayCanvas.height,
										0, 0, displayCanvas.width, displayCanvas.height);
			//instance.shading = true;
		}
		else {
			displayContext.drawImage(snowflakeCanvas,
										0, 0, displayCanvas.width, displayCanvas.height,
										0, 0, displayCanvas.width, displayCanvas.height);
			//instance.shading = false;
		}
	}

  instance.drawExportCanvas = function (exportCanvasContext, displayBackgroundCanvas, displayCanvas) {
    //draw elements
    exportCanvasContext.drawImage(displayBackgroundCanvas, 0,0,displayCanvas.width,displayCanvas.height,0,0,displayCanvas.width,displayCanvas.height);
    exportCanvasContext.drawImage(displayCanvas, 0,0,displayCanvas.width,displayCanvas.height,0,0,displayCanvas.width,displayCanvas.height);

    //add printed url to image
    exportCanvasContext.fillStyle = instance.urlColor;
    exportCanvasContext.font = 'bold italic 10px Helvetica, Arial, sans-serif';
    exportCanvasContext.textBaseline = "top";
    var caption = "Made with the paper snowflake maker at www.rectangleworld.com";
    var metrics = exportCanvasContext.measureText(caption);
    exportCanvasContext.fillText(caption, displayCanvas.width - metrics.width - 20, displayCanvas.height);
  }

  instance.changeShading = function (checked, displayCanvas, offScreenCanvases) {
    let shadingCanvas = offScreenCanvases["shading"];
    let bufferCanvas = offScreenCanvases["buffer"];
    let bufferContext = bufferCanvas.getContext('2d');
    let snowflakeCanvas = offScreenCanvases["snowflake"];
    let snowflakeContext = snowflakeCanvas.getContext('2d');
    let shadowCanvas = offScreenCanvases["shadow"];
    let shadowContext = shadowCanvas.getContext('2d');
    let displayContext = displayCanvas.getContext('2d');
    if (checked) {
      //if (!instance.shading) {
        instance.drawShadedSnowflakeToBuffer(shadingCanvas, bufferContext, snowflakeContext);
        instance.makeShadow(snowflakeContext, shadowContext);
        instance.shading = true;
      //}
      //clearDisplay();
      displayContext.clearRect(-1, -1, displayCanvas.width+2, displayCanvas.height+2);
      displayContext.drawImage(shadowCanvas,
                  0, 0, displayCanvas.width, displayCanvas.height,
                  0, 0, displayCanvas.width, displayCanvas.height);
      displayContext.drawImage(bufferCanvas,
                    0, 0, displayCanvas.width, displayCanvas.height,
                    0, 0, displayCanvas.width, displayCanvas.height);
    } else {
      //clearDisplay();
      displayContext.clearRect(-1, -1, displayCanvas.width+2, displayCanvas.height+2);
      displayContext.drawImage(shadowCanvas,
                  0, 0, displayCanvas.width, displayCanvas.height,
                  0, 0, displayCanvas.width, displayCanvas.height);
      displayContext.drawImage(snowflakeCanvas,
                    0, 0, displayCanvas.width, displayCanvas.height,
                    0, 0, displayCanvas.width, displayCanvas.height);
      instance.shading = false;
    }
  }

  instance.addCurrentBoardToHistory = function (boardCanvas, setUndoButtonActive) {
		setUndoButtonActive();

		var historyCanvas = document.createElement('canvas');
    historyCanvas.width = boardCanvas.width;
		historyCanvas.height = boardCanvas.height;
		var historyContext = historyCanvas.getContext("2d");

		//copy current to history
		historyContext.drawImage(boardCanvas, 0, 0, boardCanvas.width, boardCanvas.height, 0, 0, boardCanvas.width, boardCanvas.height);

		//put in history list, shorten history if necessary
		if (instance.history.first == null) {
			instance.history.first = historyContext;
			instance.history.last = historyContext;
			instance.historyLength = 1;
		} else {
			historyContext.next = instance.history.first;
			instance.history.first.prev = historyContext;
			instance.history.first = historyContext;
			instance.historyLength = instance.historyLength + 1;
		}
		if (instance.historyLength > instance.numUndoLevels + 1) {
			instance.history.last.canvas = null;
			instance.history.last.prev.next = null; //(will it be garbage collected?)
			instance.history.last = instance.history.last.prev;
			instance.historyLength = instance.numUndoLevels + 1;
		}
	}

  instance.clearHistory = function () {
    while (instance.historyLength > 0) {
      instance.history.first.canvas.getContext('2d').clearRect(0, 0, instance.history.first.canvas.width, instance.history.first.canvas.height);
      if (instance.historyLength > 1) {
        instance.history.first.next.prev = null;
        instance.history.first = instance.history.first.next;
      } else {
        instance.history.first = null;
      }
      instance.historyLength = instance.historyLength - 1;
    }
    //setUndoButtonInactive();
  }

  instance.undo = function (boardCanvas, displayCanvas, offScreenCanvases, setUndoButtonInactive) {
    // if (clearDrawingBoard) {
    //   //first clear board of any active lines
    //   polygonLayerContext.clearRect(-1,-1,boardWidth+2,boardHeight+2);
    // }
    //
    // if (drawing) {
    //   cancelDrawing();
    //   return;
    // }
    if (instance.historyLength === 1) {
      //this means the board still has a blank triangle
      return;
    }

    //first history state will be copy of current so remove it
    //instance.history.first.canvas = null;
    instance.history.first.canvas.getContext('2d').clearRect(0, 0, instance.history.first.canvas.width, instance.history.first.canvas.height);
    instance.history.first.next.prev = null;
    instance.history.first = instance.history.first.next;
    instance.historyLength = instance.historyLength - 1;
    let boardContext = boardCanvas.getContext('2d');
    boardContext.clearRect(-1, -1, boardCanvas.width+2, boardCanvas.height+2);
    boardContext.drawImage(instance.history.first.canvas,
                0, 0, boardCanvas.width, boardCanvas.height,
                0, 0, boardCanvas.width, boardCanvas.height);
    if (instance.historyLength === 1) {
      setUndoButtonInactive();
    }

    if (instance.autoUpdate) {
      instance.drawSnowflake(boardCanvas, displayCanvas, offScreenCanvases);
    }

    //instance.shading = false;
  }

  instance.updatePolygonDrawing = function (ctx, width, height, dots, mouseX, mouseY) {
    let i;
    ctx.clearRect(-1, -1, width+2, height+2);
    //lines
    ctx.strokeStyle = polygonLineColor;
    ctx.beginPath();
    ctx.moveTo(dots[0].x, dots[0].y);
    for (i = 1; i < dots.length; i++) {
      ctx.lineTo(dots[i].x, dots[i].y);
    }
    if (dots[0].mouseOverMe(mouseX, mouseY) && (dots.length > 1)) {
      //snap
      ctx.lineTo(dots[0].x, dots[0].y);
      ctx.stroke();
      dots[0].highlight();
    }
    else {
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
    //dots
    for (i = 0; i < dots.length; i++) {
      dots[i].drawMe();
    }
  }

  instance.redToAlphaFilter = function (ctx) {
    var canvas = ctx.canvas;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixelData = imageData.data;
    var len = pixelData.length;
    var i;
    for (i = 0; i < len; i += 4) {
      pixelData[i+3] *= pixelData[i]/255.0;
      //make white at same time
      if (pixelData[i] !== 255) {
        pixelData[i] = 255;
        pixelData[i+1] = 255;
        pixelData[i+2] = 255;
      }

    }
    ctx.putImageData(imageData, 0, 0);
  }

  instance.drawPolygonToBoard = function (ctx, dots) {
    var i;
    var len = dots.length;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(dots[0].x, dots[0].y);
    for (i = 1; i < len; i++) {
      ctx.lineTo(dots[i].x, dots[i].y);
    }
    ctx.lineTo(dots[0].x, dots[0].y);
    ctx.fill();
    instance.redToAlphaFilter(ctx);
  }

  instance.drawClosedPolygon = function (ctx, width, height, dots) {
    let i;
    ctx.clearRect(-1, -1, width+2, height+2);
    //lines
    ctx.strokeStyle = polygonLineColor;
    ctx.beginPath();
    ctx.moveTo(dots[0].x, dots[0].y);
    for (i = 1; i < dots.length; i++) {
      ctx.lineTo(dots[i].x, dots[i].y);
    }
    ctx.lineTo(dots[0].x, dots[0].y);
    ctx.stroke();

    //dots
    for (i = 0; i < dots.length; i++) {
      dots[i].drawMe();
    }
  }

  instance.closeShape = function (ctx, width, height, dots, board, activateUndo, displayCanvas, offScreenCanvases) {
    instance.drawClosedPolygon(ctx, width, height, dots);
    //draw polygon to board layer
    instance.drawPolygonToBoard(board, dots);
    //store history
    instance.addCurrentBoardToHistory(board.canvas, activateUndo);

    //instance.shading = false;
    if (instance.autoUpdate) {
      instance.drawSnowflake(board.canvas, displayCanvas, offScreenCanvases);
    }
  }

  return instance;
})();
