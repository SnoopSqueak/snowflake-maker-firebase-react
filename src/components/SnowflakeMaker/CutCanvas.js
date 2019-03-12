import React, { Component } from 'react';

class CutCanvas extends Component {

  render () {
    let width = this.props.width || 250;
    let height = this.props.height || 440;
    return (
      <div id="boardCanvasHolder">
        <canvas id="polygonLayer" width={`${width}px`} height={`${height}px`}></canvas>
        <canvas id="boardCanvas" width="250px" height="440px"></canvas>
        <canvas id="boardBackgroundCanvas" width="250px" height="440px"></canvas>
      </div>
    );
  }
}

export default CutCanvas;
