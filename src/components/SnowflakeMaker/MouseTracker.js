import Dot from './Dot';
import artSupplies from './artSupplies';

class MouseTracker {
  constructor (canvas, board, display, offScreenCanvases, parent) {
    this.canvas = canvas;
    this.board = board;
    this.display = display;
    this.offScreenCanvases = offScreenCanvases;
    this.drawing = false;
    this.dots = [];
    // a reference to the Component because I got tired of passing individual properties...
    //   I would love to clean this code up some time, I'm embarrassed by this
    //   implementation. However, the Firebase integration is the important part,
    //   so I won't spend much more time refactoring the rest at this time.

    // If you're looking for a (possibly very frustrating) challenge...
    //   Good luck!
    this.parent = parent;
    this.handlers = {
      "drawing": this.mouseMoveWhileDrawing.bind(this),
      "ending": this.endDrag.bind(this),
      "dragging": this.mouseMoveWhileDragging.bind(this),
      "clicking": this.mouseDownHandler.bind(this)
    }
    this.canvas.addEventListener("mousedown", this.handlers["clicking"], false);
  }

  handleAdd () {
    this.canvas.getContext('2d').clearRect(-1,-1,this.canvas.width+2,this.canvas.height+2);
    this.dots = [];
    this.drawing = false;
    window.removeEventListener("mousemove", this.handlers["drawing"], false);
  }

  handleReset (displayCanvas, preconfirmed=false) {
    if (preconfirmed || window.confirm('Lose any changes since last save and start a new snowflake?')) {
      if (this.drawing) {
        //cancelDrawing();
        this.handleAdd();
        return;
      }
      this.dots = [];
      this.drawing = false;
      artSupplies.clearHistory();
      this.parent.deactivateUndo();
      //clearDisplay();
      displayCanvas.getContext('2d').clearRect(-1, -1, displayCanvas.width+2, displayCanvas.height+2);
      //drawTriangle();
      const ctx = this.board.getContext('2d');
      ctx.clearRect(-1, -1, this.board.width+2, this.board.height+2);
      let bottomPoint = {x: Math.floor(this.board.width/2), y: this.board.height - 20};
      artSupplies.drawTriangle(ctx, bottomPoint);

      artSupplies.addCurrentBoardToHistory(this.board, this.parent.activateUndo);
      this.canvas.getContext('2d').clearRect(-1, -1, this.canvas.width+2, this.canvas.height+2);
      artSupplies.shadedSnowflakeCurrent = false;
    }
  }

  getMousePosition (evt) {
    var bRect = this.canvas.getBoundingClientRect();
    this.mouseX = (evt.clientX - bRect.left)*(this.canvas.width/bRect.width);
    this.mouseY = (evt.clientY - bRect.top)*(this.canvas.height/bRect.height);
  }

  mouseMoveWhileDrawing (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.getMousePosition(evt);
    artSupplies.updatePolygonDrawing(this.canvas.getContext("2d"), this.canvas.width, this.canvas.height, this.dots, this.mouseX, this.mouseY);
  }

  mouseMoveWhileDragging (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.getMousePosition(evt);
    this.dots[this.dotToDragIndex].x = this.mouseX;
    this.dots[this.dotToDragIndex].y = this.mouseY;
    artSupplies.drawClosedPolygon(this.canvas.getContext('2d'), this.canvas.width, this.canvas.height, this.dots);
  }

  undo (clearDrawingBoard) {
    if (clearDrawingBoard) {
      //first clear board of any active lines
      this.canvas.getContext('2d').clearRect(-1,-1,this.canvas.width+2,this.canvas.height+2);
    }

    if (this.drawing) {
      //cancelDrawing();
      this.handleAdd();
      return;
    }
    artSupplies.undo(this.board, this.display, this.offScreenCanvases, this.parent.deactivateUndo);
  }

  endDrag(evt) {
    //go back to previous state before redrawing polygon
    this.undo(false);
    artSupplies.drawPolygonToBoard(this.board.getContext('2d'), this.dots);
    artSupplies.addCurrentBoardToHistory(this.board, this.parent.activateUndo);

    if (artSupplies.autoUpdate) {
      artSupplies.drawSnowflake(this.board, this.display, this.offScreenCanvases);
    }

    window.removeEventListener("mousemove", this.handlers["dragging"], false);
    window.removeEventListener("mouseup", this.handlers["ending"], false);
  }

  mouseDownHandler (evt) {
		var i;
		var found;
    var newDot;
		this.getMousePosition(evt);

		if (!this.drawing) {
			//check if mouse down was on an existing dot, and if so set drag behavior
			i = 0;
			found = false;
			while ((!found) && (i < this.dots.length)) {
				 if (this.dots[i].mouseOverMe(this.mouseX, this.mouseY)) {
					 found = true;
					 this.dotToDragIndex = i;
				 }
				 i++;
			}
			if (found) {
				//
				window.addEventListener("mousemove", this.handlers["dragging"], false);
				window.addEventListener("mouseup", this.handlers["ending"], false);
			}
			//otherwise start drawing a new polygon
			else {
				this.dots = [];
				this.drawing = true;
				newDot = new Dot(this.mouseX, this.mouseY, artSupplies.firstDotColor, this.canvas.getContext('2d'));
				newDot.rad = Dot.FIRST_DOT_RAD;
				this.dots.push(newDot);
				artSupplies.updatePolygonDrawing(this.canvas.getContext("2d"), this.canvas.width, this.canvas.height, this.dots, this.mouseX, this.mouseY);
				window.addEventListener("mousemove", this.handlers["drawing"], false);
			}
		}
		else {
			//check if mouse down was on first dot
			if (this.dots[0].mouseOverMe(this.mouseX, this.mouseY) && (this.dots.length > 2)) {
        this.drawing = false;
        window.removeEventListener("mousemove", this.handlers["drawing"], false);
				artSupplies.closeShape(this.canvas.getContext('2d'), this.canvas.width, this.canvas.height, this.dots, this.board.getContext('2d'), this.parent.activateUndo, this.display, this.offScreenCanvases);
			}
			else {
				newDot = new Dot(this.mouseX, this.mouseY, artSupplies.dotColor, this.canvas.getContext('2d'));
				this.dots.push(newDot);
				artSupplies.updatePolygonDrawing(this.canvas.getContext("2d"), this.canvas.width, this.canvas.height, this.dots, this.mouseX, this.mouseY);
				window.addEventListener("mousemove", this.handlers["drawing"], false);
			}
		}
	}
}
export default MouseTracker;
