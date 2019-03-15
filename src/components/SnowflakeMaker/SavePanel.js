import React, { Component } from 'react';

class SavePanel extends Component {

  render () {
    return (
      <div id="infoPanel">
        <div id="saveButtonsHolder">
          <div id="savePanel">
            <div style={{width: "50%", height: "100%", padding: "0", margin: "0", display: "inline-block"}}>
              <button id="btnSave" className="save">Save image to your computer</button>
                <div style={{color: "black", marginRight: "75px"}}>OR</div>
              <button id="btnSaveFirebase" className="save">Save image to Firebase</button>
            </div>
          </div>
          <div id="clear" style={{"clear":"both"}}></div>
        </div>
        <div id="instructionsText">
          To "cut" the paper away, draw polygons (closed shapes)
          representing scissor cuts over the triangle in the drawing
          board to the right. Draw a polygon by clicking on the board to
          create vertices, and close the polygon by clicking on the first
          vertex. After a polygon is closed, it can be edited by dragging
          vertices. To finalize a polygon, press the "add" button, or
          simply start drawing a new polygon.
        </div>
      </div>
    );
  }
}

export default SavePanel;
