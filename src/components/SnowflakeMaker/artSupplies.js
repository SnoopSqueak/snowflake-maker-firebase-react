import * as stackblur from './stackblur';

export default (() => {
  const instance = {};
  const grays = [255,242,234,250,233,249,232,217,249,232,249,234];
  instance.dotColor = "rgba(255,0,0,0.5)";
  instance.firstDotColor = "rgba(16,220,0,0.5)";
  instance.autoUpdate = false;
  const polygonLineColor = "rgba(0,0,0,0.75)";
  instance.history = [];
  instance.historyLength = 0;
  instance.numUndoLevels = 50;

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

  instance.drawTriangle = function (ctx, bottomPoint, triangleHyp) {
    let longLeg = triangleHyp*Math.sqrt(3)/2;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(bottomPoint.x, bottomPoint.y);
    ctx.lineTo(bottomPoint.x - triangleHyp*Math.sin(Math.PI/12),
              bottomPoint.y - triangleHyp*Math.cos(Math.PI/12));
    ctx.lineTo(bottomPoint.x + longLeg*Math.sin(Math.PI/12),
              bottomPoint.y - longLeg*Math.cos(Math.PI/12));
    ctx.lineTo(bottomPoint.x, bottomPoint.y);
    ctx.stroke();
    ctx.fill();
  }

  instance.addCurrentBoardToHistory = function (boardCanvas) {
		//setUndoButtonActive();

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
		}
		else {
			historyContext.next = instance.history.first;
			instance.history.first.prev = historyContext;
			instance.history.first = historyContext;
			instance.historyLength = instance.historyLength++;
		}
		if (instance.historyLength > instance.numUndoLevels + 1) {
			instance.history.last.canvas = null;
			instance.history.last.prev.next = null; //(will it be garbage collected?)
			instance.history.last = instance.history.last.prev;
			instance.historyLength = instance.numUndoLevels + 1;
		}
	}

  instance.updatePolygonDrawing = function (ctx, width, height, dots, mouseX, mouseY) {
    let i;
    ctx.clearRect(-1,-1,width+2,height+2);
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
    ctx.clearRect(-1,-1,width+2,height+2);
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

  instance.closeShape = function (ctx, width, height, dots, board) {
    instance.drawClosedPolygon(ctx, width, height, dots);
    //draw polygon to board layer
    instance.drawPolygonToBoard(board, dots);
    //store history
    instance.addCurrentBoardToHistory(board.canvas);

    instance.shadedSnowflakeCurrent = false;
    if (instance.autoUpdate) {
      instance.drawSnowflake();
    }
  }

  return instance;
})();
