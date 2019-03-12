import React, { Component } from 'react';
import artSupplies from './artSupplies';
import MouseTracker from './MouseTracker';

class SnowflakeCanvas extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 440;
    this.height = this.props.height || 440;
    this.boardWidth = this.props.boardWidth || 250;
    this.triangleHyp = 400.0;
    this.snowflakeRadius = 200.0;
    this.dots = [];
  }

  componentDidMount () {
    //off screen canvases
    this.createCanvas("shading");
    this.createCanvas("snowflake");
    this.createCanvas("shadow");
    this.createCanvas("buffer");
    this.mouseTracker = new MouseTracker(this.refs.polys, this.refs.board);
    this.drawEverything();
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    this.drawEverything();
  }

  createCanvas (name) {
    let canvasName = name + "Canvas";
    this[canvasName] = document.createElement('canvas');
    this[canvasName].width = this.width;
    this[canvasName].height = this.height;
  }

  drawEverything () {
    this.updateBoard();
    this.updateCanvas();
  }

  updateCanvas () {
    const bgCtx = this.refs.bgCanvas.getContext('2d');
    bgCtx.drawImage(this.props.gradientBackground,
                  0, 0, this.width,this.height,
                  0, 0, this.width,this.height);

    const shadingCtx = this.shadingCanvas.getContext('2d');
    artSupplies.drawShading(shadingCtx, this.snowflakeRadius + 2, -Math.PI/2, Math.PI/6, this.width, this.height);
  }

  updateBoard () {
    const bgCtx = this.refs.bgBoard.getContext('2d');
    bgCtx.fillStyle = this.props.color;
    bgCtx.fillRect(0, 0, this.boardWidth, this.height);

    const ctx = this.refs.board.getContext('2d');
    ctx.clearRect(-1,-1,this.boardWidth+2, this.height+2);
    let bottomPoint = {x: Math.floor(this.boardWidth/2), y: this.height - 20};
    artSupplies.drawTriangle(ctx, bottomPoint, this.triangleHyp);

    //const polys = this.refs.polys.getContext('2d');

  }

  render () {
    return (
      <div>
        <div id="displayCanvasHolder">
          <canvas id="displayCanvas" ref="canvas" width={`${this.width}px`} height={`${this.height}px`}>Your browser does not support HTML5 canvas.</canvas>
          <canvas id="displayBackgroundCanvas" ref="bgCanvas" width={`${this.width}px`} height={`${this.height}px`}></canvas>
        </div>
        <div id="boardCanvasHolder">
          <canvas id="polygonLayer" ref="polys" width={`${this.boardWidth}px`} height={`${this.height}px`}></canvas>
          <canvas id="boardCanvas" ref="board" width={`${this.boardWidth}px`} height={`${this.height}px`}></canvas>
          <canvas id="boardBackgroundCanvas" ref="bgBoard" width={`${this.boardWidth}px`} height={`${this.height}px`}></canvas>
        </div>
      </div>
    );
  }
}

export default SnowflakeCanvas;
