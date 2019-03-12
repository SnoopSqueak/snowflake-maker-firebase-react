import React, { Component } from 'react';

class SnowflakeCanvas extends Component {

  render () {
    return (
      <div id="displayCanvasHolder">
        <canvas id="displayCanvas" width="440px" height="440px">Your browser does not support HTML5 canvas.</canvas>
        <canvas id="displayBackgroundCanvas" width="440px" height="440px"></canvas>
      </div>
    );
  }
}

export default SnowflakeCanvas;
