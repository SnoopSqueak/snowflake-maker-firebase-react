import React, { Component } from 'react';

class SnowflakeCanvas extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 440;
    this.height = this.props.height || 440;
  }

  componentDidMount () {
      this.updateCanvas();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateCanvas();
  }

  updateCanvas () {
    //const ctx = this.refs.canvas.getContext('2d');
    const bgCtx = this.refs.bgCanvas.getContext('2d');
    bgCtx.drawImage(this.props.gradientBackground,
                  0, 0, this.width,this.height,
                  0, 0, this.width,this.height);
  }

  render () {
    return (
      <div id="displayCanvasHolder">
        <canvas id="displayCanvas" ref="canvas" width={`${this.width}px`} height={`${this.height}px`}>Your browser does not support HTML5 canvas.</canvas>
        <canvas id="displayBackgroundCanvas" ref="bgCanvas" width={`${this.width}px`} height={`${this.height}px`}></canvas>
      </div>
    );
  }
}

export default SnowflakeCanvas;
