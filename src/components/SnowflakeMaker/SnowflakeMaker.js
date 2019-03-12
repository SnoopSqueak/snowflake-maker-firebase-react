import React, { Component } from 'react';
import SnowflakeCanvas from './SnowflakeCanvas';
import CutCanvas from './CutCanvas';
import CanvasButtons from './CanvasButtons';
import SavePanel from './SavePanel';
import Controls from './controls';

class SnowflakeMaker extends Component {
  componentDidMount () {
    Controls.windowLoadHandler();
  }

  render () {
    return (
      <div>
        <div id="container">
          <SnowflakeCanvas />
          <CutCanvas />
          <CanvasButtons />
        </div>
        <div id="container2">
          <SavePanel />
        </div>
      </div>
    );
  }
}

export default SnowflakeMaker;
