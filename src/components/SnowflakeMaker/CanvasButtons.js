import React, { Component } from 'react';

class CanvasButtons extends Component {
  constructor (props) {
    super(props);
    function getCssValuePrefix(name, value) {
      var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];

      // Create a temporary DOM object for testing
      var dom = document.createElement('div');

      for (var i = 0; i < prefixes.length; i++) {
        // Attempt to set the style
        dom.style[name] = prefixes[i] + value;

        // Detect if the style was successfully set
        if (dom.style[name]) {
          return prefixes[i];
        }
        dom.style[name] = '';   // Reset the style
      }
    }

    this.gradientPrefix = getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)');
  }

  render () {
    return (
      <div id="buttonPanel">
          <div id="titleText" style={{"background": this.props.bgColor.start}}>paper snowflake maker</div>
          <div id="urlText" style={{"background": this.props.bgColor.textBG || this.props.bgColor.end}}><a href="http://rectangleworld.com">by<br/>RectangleWorld</a></div>
          <div id="urlText2" style={{"background": this.props.bgColor.start}}><a href="http://rectangleworld.com/blog/about" target="_blank" rel="noopener noreferrer">about</a></div>
          <div id="buttonPanelContent">
            <div id="colorButtonsLabel">choose a<br/>background:</div>
            <div id="colorButtonPanel">
              {
                this.props.bgColors.map((bgColor, index) => {
                  return (
                    <input type="button" value="" title={bgColor.name} key={index} className="colorButton"
                      style={{backgroundImage: this.gradientPrefix + "linear-gradient(" +bgColor.start+ ", " +bgColor.end+ ")"}}
                      onClick={() => this.props.setIndex(index)}
                    />
                  );
                })
              }
            </div>
              <ul>
                <li><input type="button" className="button1" id="btnAdd" value="add" title="Click to commit the currently drawn polygon (you can also just start drawing a new one)."/></li>
                <li><input type="button" className="button1_inactive" id="btnUndo" value="undo" title="undo"/></li>
                <li><input type="button" className="button1" id="btnReset" value="reset" title="start over"/></li>
                <li><input type="button" className="button1" id="btnMakeSnowflake" value="make snowflake!" style={{"fontWeight":"bold", "whiteSpace":"normal"}} title="See your snowflake!"/></li>
                <li><label title="Creates a folded paper appearance."><input type="checkbox" className="checkbox1" id="cbShading" defaultChecked=""/>shading on</label></li>
                <li><label title="Causes the snowflake to be redrawn every time you change the triangle."><input type="checkbox" className="checkbox1" id="cbAutoUpdate"/>auto update</label></li>
              </ul>
          </div>
      </div>
    );
  }
}

export default CanvasButtons;
