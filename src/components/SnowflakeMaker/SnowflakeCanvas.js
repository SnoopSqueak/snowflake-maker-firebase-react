import React, { Component } from 'react';
import artSupplies from './artSupplies';
import MouseTracker from './MouseTracker';
//import * as firebase from 'firebase';

class SnowflakeCanvas extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 440;
    this.height = this.props.height || 440;
    this.boardWidth = this.props.boardWidth || 250;
    this.dots = [];
    this.offScreenCanvases = {};
    this.provider = this.props.provider;
    this.saveFirebase = this.saveFirebase.bind(this);
    this.exportImage = this.exportImage.bind(this);
    this.usersRef = this.props.firebase.database().ref('users');
    this.snowflakesRef = this.props.firebase.database().ref('snowflakes');
    this.currentSnowflake = null;
  }

  componentDidMount () {
    this.currentSnowflake = this.props.linkState ? this.props.linkState.currentSnowflake : null;
    //off screen canvases
    this.createCanvas("shading");
    this.createCanvas("snowflake");
    this.createCanvas("shadow");
    this.createCanvas("buffer");
    this.createCanvas("export");
    this.createCanvas("exportBoard");
    if (!this.mouseTracker) this.mouseTracker = new MouseTracker(this.refs.polys, this.refs.board, this.refs.canvas, this.offScreenCanvases, this);
    this.mouseTracker.handleReset(this.refs.canvas, true);
    document.getElementById("btnSave").addEventListener("click", this.exportImage, false);
    document.getElementById("btnSaveFirebase").addEventListener("click", this.saveFirebase, false);
    this.drawEverything();
    const ctx = this.refs.board.getContext('2d');
    ctx.clearRect(-1,-1,this.boardWidth+2, this.height+2);
    if (this.currentSnowflake) {
      this.snowflakesRef.child(this.currentSnowflake).once('value')
      .then((snapshot) => {
        this.props.setIndex(snapshot.val().color);
        var img = new Image();
        img.src = snapshot.val().data;
        img.onload = () => {
          this.refs.board.getContext('2d').drawImage(img, 0, 0);
          artSupplies.history = {};
          artSupplies.historyLength = 0;
          artSupplies.addCurrentBoardToHistory(this.refs.board, this.activateUndo);
          this.drawSnowflake();
          if (this.props.linkState.copy) {
            this.currentSnowflake = null;
          }
        }
      });
    } else {
      let bottomPoint = {x: Math.floor(this.boardWidth/2), y: this.height - 20};
      artSupplies.drawTriangle(ctx, bottomPoint);
    }
    this.changeShading();
    this.changeAutoUpdate();
  }

  componentWillUnmount () {
    document.getElementById("btnSave").removeEventListener("click", this.exportImage, false);
    document.getElementById("btnSaveFirebase").removeEventListener("click", this.saveFirebase, false);
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    this.drawEverything();
  }

  changeShading () {
    artSupplies.changeShading(this.refs.shadingCb.checked, this.refs.canvas, this.offScreenCanvases);
  }

  changeAutoUpdate () {
    artSupplies.autoUpdate = this.refs.autoUpdateCb.checked;
  }

  createCanvas (canvasName) {
    if (this.offScreenCanvases[canvasName]) return;
    this.offScreenCanvases[canvasName] = document.createElement('canvas');
    this.offScreenCanvases[canvasName].width = this.width;
    this.offScreenCanvases[canvasName].height = this.height;
  }

  drawEverything () {
    this.updateBoard();
    this.updateCanvas();
  }

  updateCanvas () {
    const bgCtx = this.refs.bgCanvas.getContext('2d');
    bgCtx.drawImage(this.props.gradientBackground,
                  0, 0, this.width,this.height,
                  0, 0, this.width,this.height);

    const shadingCtx = this.offScreenCanvases["shading"].getContext('2d');
    artSupplies.drawShading(shadingCtx, artSupplies.snowflakeRadius + 2, -Math.PI/2, Math.PI/6, this.width, this.height);
  }

  updateBoard () {
    const bgCtx = this.refs.bgBoard.getContext('2d');
    bgCtx.fillStyle = this.props.color;
    bgCtx.fillRect(0, 0, this.boardWidth, this.height);
  }

  deactivateUndo () {
    document.getElementById("btnUndo").className = "button1_inactive";
  }

  activateUndo () {
    document.getElementById("btnUndo").className = "button1";
  }

  exportImage (evt) {
    this.drawSnowflake();
		artSupplies.drawExportCanvas(this.offScreenCanvases["export"].getContext('2d'), this.refs.bgCanvas, this.refs.canvas);
    // click to save
    var dataURL = this.offScreenCanvases["export"].toDataURL("image/png");
    var link = document.createElement("a");
    link.setAttribute("href", dataURL);
    link.setAttribute("download", "snowflake");
    link.click();
	}

  saveFirebase () {
    if (!this.props.firebase.auth().currentUser) {
      alert("Please log in to use the database. Only your Google account's unique ID will be stored to the database, not your email or name. Anyone with the UID could find your profile and any public information on it.");
    } else {
      this.drawSnowflake();
      // Make the image export canvas half the size of the others
      this.offScreenCanvases["export"].width = this.width/2;
      this.offScreenCanvases["export"].height = this.height/2;
      this.offScreenCanvases["export"].getContext('2d').scale(.5, .5);
      artSupplies.drawExportCanvas(this.offScreenCanvases["export"].getContext('2d'), this.refs.bgCanvas, this.refs.canvas);
      artSupplies.drawExportCanvas(this.offScreenCanvases["exportBoard"].getContext('2d'), null, this.refs.board);
      var imgURL = this.offScreenCanvases["export"].toDataURL("image/png");
      var dataURL = this.offScreenCanvases["exportBoard"].toDataURL("image/png");
      if (!this.currentSnowflake) {
        this.snowflakesRef.push({
          image: imgURL,
          data: dataURL,
          user: this.props.firebase.auth().currentUser.uid,
          color: this.props.colorIndex
        }).then((res) => {
          this.currentSnowflake = res.key;
          alert("Saved new snowflake!");
        }).catch((e) => {
          alert("Error while saving snowflake, check the console for more information.");
          console.log(e);
        });
      } else {
        // Make sure the user's ID matches, otherwise create a new snowflake instead
        this.snowflakesRef.child(this.currentSnowflake).once('value').then((snapshot) => {
          let errorCallback = (e) => {
            alert("Error while saving snowflake, check the console for more information.");
            console.log(e);
          };
          if (snapshot.val().user !== this.props.firebase.auth().currentUser.uid) {
            this.snowflakesRef.push({
              image: imgURL,
              data: dataURL,
              user: this.props.firebase.auth().currentUser.uid,
              color: this.props.colorIndex
            }).then((res) => {
              this.currentSnowflake = res.key;
              alert("Saved new snowflake!");
            }).catch(errorCallback);
          } else {
            this.snowflakesRef.child(this.currentSnowflake).set({
              image: imgURL,
              data: dataURL,
              user: this.props.firebase.auth().currentUser.uid,
              color: this.props.colorIndex
            }).then((res) => {
              alert("Saved snowflake, overwrote old data.");
            }).catch(errorCallback);
          }
        });
      }
    }
  }

  drawSnowflake () {
    artSupplies.drawSnowflake(this.refs.board, this.refs.canvas, this.offScreenCanvases)
  }

  handleReset () {
    this.currentSnowflake = null;
    this.mouseTracker.handleReset(this.refs.canvas);
  }

  render () {
    return (
      <div>
        <div id="displayCanvasHolder">
          <canvas id="displayCanvas" ref="canvas" width={`${this.width}px`} height={`${this.height}px`}>Your browser does not support HTML5 canvas.</canvas>
          <canvas id="displayBackgroundCanvas" ref="bgCanvas" width={`${this.width}px`} height={`${this.height}px`}></canvas>
        </div>
        <div id="boardCanvasHolder">
          <canvas id="polygonLayer" ref="polys" width={`${this.boardWidth}px`} height={`${this.height}px`}></canvas>
          <canvas id="boardCanvas" ref="board" width={`${this.boardWidth}px`} height={`${this.height}px`}></canvas>
          <canvas id="boardBackgroundCanvas" ref="bgBoard" width={`${this.boardWidth}px`} height={`${this.height}px`}></canvas>
        </div>
        <div id="buttonPanel">
            <div id="titleText" style={{"background": this.props.bgColor.start}}>paper snowflake maker</div>
            <div id="urlText" style={{"background": this.props.bgColor.textBG || this.props.bgColor.end}}><a href="http://rectangleworld.com">Originally by<br/>RectangleWorld</a></div>
            <div id="urlText2" style={{"background": this.props.bgColor.start}}><a href="http://rectangleworld.com/blog/about" target="_blank" rel="noopener noreferrer">about</a></div>
            <div id="buttonPanelContent">
              <div id="colorButtonsLabel">choose a<br/>background:</div>
              <div id="colorButtonPanel">
                {
                  this.props.bgColors.map((bgColor, index) => {
                    return (
                      <input type="button" value="" title={bgColor.name} key={index} className="colorButton"
                        style={{backgroundImage: artSupplies.gradientPrefix + "linear-gradient(" +bgColor.start+ ", " +bgColor.end+ ")"}}
                        onClick={() => this.props.setIndex(index)}
                      />
                    );
                  })
                }
              </div>
                <ul>
                  <li><input type="button" className="button1" id="btnAdd" value="add" title="Click to commit the currently drawn polygon (you can also just start drawing a new one)." onClick={() => this.mouseTracker.handleAdd()}/></li>
                  <li><input type="button" className="button1_inactive" id="btnUndo" value="undo" title="undo" onClick={() => this.mouseTracker.undo(true)}/></li>
                  <li><input type="button" className="button1" id="btnReset" value="new snowflake" title="start over" onClick={() => this.handleReset()} /></li>
                  <li><input type="button" className="button1" id="btnMakeSnowflake" value="make snowflake!" style={{"fontWeight":"bold", "whiteSpace":"normal"}} title="See your snowflake!" onClick={() => this.drawSnowflake()}/></li>
                  <li><label title="Creates a folded paper appearance."><input ref="shadingCb" type="checkbox" className="checkbox1" id="cbShading" onChange={(e) => this.changeShading()} defaultChecked={true}/>shading on</label></li>
                  <li><label title="Causes the snowflake to be redrawn every time you change the triangle."><input ref="autoUpdateCb" type="checkbox" className="checkbox1" id="cbAutoUpdate" onChange={(e) => this.changeAutoUpdate()} defaultChecked={true}/>auto update</label></li>
                </ul>
            </div>
        </div>
      </div>
    );
  }
}

export default SnowflakeCanvas;
