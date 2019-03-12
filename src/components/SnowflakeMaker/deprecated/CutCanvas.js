import React, { Component } from 'react';
import * as stackblur from './stackblur';
import artSupplies from './artSupplies';

class CutCanvas extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 250;
    this.height = this.props.height || 440;
  }

  componentDidMount () {
    //off screen canvas
    this.paperShadingCanvas = document.createElement('canvas');
    this.paperShadingCanvas.width = this.width;
    this.paperShadingCanvas.height = this.height;
    this.paperShadingContext = this.paperShadingCanvas.getContext("2d");
    this.updateCanvas();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateCanvas();
  }

  updateCanvas () {
    const bgCtx = this.refs.bgCanvas.getContext('2d');
    bgCtx.fillStyle = this.props.color;
    bgCtx.fillRect(0, 0, this.width, this.height);

    const ctx = this.refs.canvas.getContext('2d');

    // I should move these somewhere else
    let triangleHyp = 400.0;
    let snowflakeRadius = 200.0;

    //function drawShading() {
      //var grays = [255,220,194,244,191,240,190,146,240,187,240,170];
      var grays = [255,242,234,250,233,249,232,217,249,232,249,234];
      var sideLength = snowflakeRadius + 2;
      var phase = -Math.PI/2;
      var angleInc = Math.PI/6;
      this.paperShadingContext.fillStyle = "#FFFFFF";
      this.paperShadingContext.fillRect(0,0,this.width,this.height);
      this.paperShadingContext.save();
      this.paperShadingContext.translate(this.width/2, this.height/2);
      for (var i = 0; i < 12; i++) {
        this.paperShadingContext.beginPath();
        this.paperShadingContext.moveTo(0,0);
        this.paperShadingContext.fillStyle = artSupplies.gray(grays[i]);
        this.paperShadingContext.lineTo(sideLength*Math.cos(phase + i*angleInc), sideLength*Math.sin(phase + i*angleInc));
        this.paperShadingContext.lineTo(sideLength*Math.cos(phase + (i+1)*angleInc), sideLength*Math.sin(phase + (i+1)*angleInc));
        this.paperShadingContext.lineTo(0,0);
        this.paperShadingContext.fill();
      }
      this.paperShadingContext.restore();

      artSupplies.applyGrayNoise(this.paperShadingContext, 4);
      stackblur.stackBlurContextRGB(this.paperShadingContext, 0, 0, this.width, this.width, 1.5);
      artSupplies.applyGrayNoise(this.paperShadingContext, 2);
    //}


    //function drawTriangle() {
      ctx.clearRect(-1,-1,this.width+2, this.height+2);
      let bottomPoint = {x: Math.floor(this.width/2), y: this.height - 20};
      var longLeg = triangleHyp*Math.sqrt(3)/2;
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
    //}
  }

  render () {
    return (
      <div id="boardCanvasHolder">
        <canvas id="polygonLayer" width={`${this.width}px`} height={`${this.height}px`}></canvas>
        <canvas id="boardCanvas" ref="canvas" width={`${this.width}px`} height={`${this.height}px`}></canvas>
        <canvas id="boardBackgroundCanvas" ref="bgCanvas" width={`${this.width}px`} height={`${this.height}px`}></canvas>
      </div>
    );
  }
}

export default CutCanvas;
