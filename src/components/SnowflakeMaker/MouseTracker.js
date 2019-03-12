import Dot from './Dot';
import artSupplies from './artSupplies';

class MouseTracker {
  constructor (canvas, board) {
    this.canvas = canvas;
    this.board = board;
    this.drawing = false;
    this.dots = [];
    this.handlers = {
      "drawing": this.mouseMoveWhileDrawing.bind(this),
      "ending": this.endDrag.bind(this),
      "dragging": this.mouseMoveWhileDragging.bind(this),
      "clicking": this.mouseDownHandler.bind(this)
    }
    this.canvas.addEventListener("click", this.handlers["clicking"], false);
  }

  getMousePosition (evt) {
    var bRect = this.canvas.getBoundingClientRect();
    this.mouseX = (evt.clientX - bRect.left)*(this.canvas.width/bRect.width);
    this.mouseY = (evt.clientY - bRect.top)*(this.canvas.height/bRect.height);
  }

  mouseMoveWhileDrawing (evt, callback) {
    evt.stopPropagation();
    evt.preventDefault();
    this.getMousePosition(evt);
    artSupplies.updatePolygonDrawing(this.canvas.getContext("2d"), this.canvas.width, this.canvas.height, this.dots, this.mouseX, this.mouseY);
  }

  mouseMoveWhileDragging (evt, callback) {
    evt.stopPropagation();
    evt.preventDefault();
    this.getMousePosition(evt);
    this.dots[this.dotToDragIndex].x = this.mouseX;
    this.dots[this.dotToDragIndex].y = this.mouseY;
    artSupplies.drawClosedPolygon();
  }

  endDrag(evt, undo, addCurrentBoardToHistory, cbAutoUpdate=true) {
    //go back to previous state before redrawing polygon
    undo(false);
    artSupplies.drawPolygonToBoard();
    addCurrentBoardToHistory();

    if (cbAutoUpdate.checked) {
      artSupplies.drawSnowflake();
    }

    window.removeEventListener("mousemove", this.handlers["dragging"], false);
    window.removeEventListener("mouseup", this.handlers["ending"], false);
  }

  mouseDownHandler (evt) {
		var numDots = this.dots.length;
		var i;
		var found;
    var newDot;
		this.getMousePosition(evt);

		if (!this.drawing) {
			//check if mouse down was on an existing dot, and if so set drag behavior
			i = 0;
			found = false;
			while ((!found) && (i < numDots)) {
				 if (this.dots[i].mouseOverMe()) {
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
				artSupplies.closeShape(this.canvas.getContext('2d'), this.canvas.width, this.canvas.height, this.dots, this.board.getContext('2d'));
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
