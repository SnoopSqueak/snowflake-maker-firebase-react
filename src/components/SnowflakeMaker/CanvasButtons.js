import React, { Component } from 'react';

class CanvasButtons extends Component {

  render () {
    return (
      <div id="buttonPanel">
          <div id="titleText" style={{"background": "rgb(88, 107, 135)"}}>paper snowflake maker</div>
          <div id="urlText" style={{"background": "rgb(133, 160, 205)"}}><a href="http://rectangleworld.com">by<br/>RectangleWorld</a></div>
          <div id="urlText2" style={{"background": "rgb(88, 107, 135)"}}><a href="http://rectangleworld.com/blog/about" target="_blank" rel="noopener noreferrer">about</a></div>
          <div id="buttonPanelContent">
            <div id="colorButtonsLabel">choose a<br/>background:</div>
            <div id="colorButtonPanel"></div>
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
