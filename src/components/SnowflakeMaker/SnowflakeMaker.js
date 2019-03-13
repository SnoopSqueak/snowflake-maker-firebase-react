import React, { Component } from 'react';
import SnowflakeCanvas from './SnowflakeCanvas';
import CanvasButtons from './CanvasButtons';
import SavePanel from './SavePanel';
import bgColors from './bgColors';
import hexToRgb from './hexToRgb';
import DitheredLinearGradient from './DitheredLinearGradient';

class SnowflakeMaker extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 440;
    this.height = this.props.height || 440;

    this.gradientBackgrounds = [];
    for (var i = 0; i < bgColors.length; i++) {
      var gradCanvas = document.createElement('canvas');
      gradCanvas.width = this.width;
      gradCanvas.height = this.height;
      var gradContext = gradCanvas.getContext("2d");
      var dgrad = new DitheredLinearGradient(-20,-20,-20+460*Math.sin(3*Math.PI/8),-20+460*Math.sin(3*Math.PI/8));
      var col = hexToRgb(bgColors[i].start);
      var col2 = hexToRgb(bgColors[i].end);
      dgrad.addColorStop(0,col2.r,col2.g,col2.b);
      dgrad.addColorStop(1,col.r,col.g,col.b);
      dgrad.fillRect(gradContext,0,0,this.width,this.height);
      this.gradientBackgrounds.push(gradCanvas);
    }

    this.state = {
      index: 0,
      gradient: this.gradientBackgrounds[0],
      color: bgColors[0].start
    }
  }

  setIndex (index) {
    this.setState({index, gradient: this.gradientBackgrounds[index], color: bgColors[index].start});
  }

  render () {
    return (
      <div>
        <div id="container">
          <SnowflakeCanvas gradientBackground={this.state.gradient} color={this.state.color} bgColors={bgColors} bgColor={bgColors[this.state.index]} setIndex={this.setIndex.bind(this)} />
        </div>
        <div id="container2">
          <SavePanel />
        </div>
      </div>
    );
  }
}

export default SnowflakeMaker;
