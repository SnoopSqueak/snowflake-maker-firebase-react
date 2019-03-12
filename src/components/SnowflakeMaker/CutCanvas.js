import React, { Component } from 'react';

class CutCanvas extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 250;
    this.height = this.props.height || 440;
  }

  componentDidMount () {
      this.updateCanvas();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateCanvas();
  }

  updateCanvas () {
    const bgCtx = this.refs.bgCanvas.getContext('2d');
    bgCtx.fillStyle = this.props.color;
    bgCtx.fillRect(0, 0, this.width, this.height);
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
