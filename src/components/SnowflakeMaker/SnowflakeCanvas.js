import React, { Component } from 'react';
import artSupplies from './artSupplies';
import MouseTracker from './MouseTracker';
import * as firebase from 'firebase';

class SnowflakeCanvas extends Component {
  constructor (props) {
    super(props);
    this.width = this.props.width || 440;
    this.height = this.props.height || 440;
    this.boardWidth = this.props.boardWidth || 250;
    this.dots = [];
    this.offScreenCanvases = {};
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount () {
    artSupplies.addCurrentBoardToHistory(this.refs.board, this.activateUndo);
    //off screen canvases
    this.createCanvas("shading");
    this.createCanvas("snowflake");
    this.createCanvas("shadow");
    this.createCanvas("buffer");
    this.createCanvas("export");
    this.mouseTracker = new MouseTracker(this.refs.polys, this.refs.board, this.refs.canvas, this.offScreenCanvases, this);
    document.getElementById("btnSave").addEventListener("click", this.exportImage.bind(this), false);
    document.getElementById("btnLogIn").addEventListener("click", this.logIn, false);
    this.drawEverything();
    const ctx = this.refs.board.getContext('2d');
    ctx.clearRect(-1,-1,this.boardWidth+2, this.height+2);
    let bottomPoint = {x: Math.floor(this.boardWidth/2), y: this.height - 20};
    artSupplies.drawTriangle(ctx, bottomPoint);
    this.changeShading();
    this.changeAutoUpdate();
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
    //let canvasName = name + "Canvas";
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

    //const polys = this.refs.polys.getContext('2d');
  }

  deactivateUndo () {
    //btnUndo.style.backgroundColor="#DDD";
    document.getElementById("btnUndo").className = "button1_inactive";
  }

  activateUndo () {
    //btnUndo.style.backgroundColor="#666";
    document.getElementById("btnUndo").className = "button1";
  }

  exportImage (evt) {
		artSupplies.drawExportCanvas(this.offScreenCanvases["export"].getContext('2d'), this.refs.bgCanvas, this.refs.canvas);
    // click to save
    var dataURL = this.offScreenCanvases["export"].toDataURL("image/png");
    var link = document.createElement("a");
    link.setAttribute("href", dataURL);
    link.setAttribute("download", "snowflake");
    link.click();
	}

  logOut (evt) {
    firebase.auth().signOut().then((result) => {
      this.setState({user: null});
      this.token = null;
      document.getElementById("logInStatus").innerText = "(Not logged in)";
      document.getElementById("btnLogIn").addEventListener("click", this.logIn, false);
      document.getElementById("btnLogIn").removeEventListener("click", this.logOut, false);
      document.getElementById("btnLogIn").innerText = "Log in with Google"
    }).catch((e) => {
      console.log("There was an error while trying to log out. Error object on next line:");
      console.log(e);
    });
  }

  logIn (evt) {
    firebase.auth().signInWithPopup(this.provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      this.token = result.credential.accessToken;
      // The signed-in user info.
      this.setState({user: result.user});
      console.log(result.user);
      document.getElementById("logInStatus").innerText = "(Logged in as: " + result.user.displayName + ")";
      document.getElementById("btnLogIn").removeEventListener("click", this.logIn, false);
      document.getElementById("btnLogIn").addEventListener("click", this.logOut, false);
      document.getElementById("btnLogIn").innerText = "Log out"
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log("There was an error while trying to log in. It might be nothing... here's the message: " + errorMessage);
    });
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
            <div id="urlText" style={{"background": this.props.bgColor.textBG || this.props.bgColor.end}}><a href="http://rectangleworld.com">by<br/>RectangleWorld</a></div>
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
                  <li><input type="button" className="button1" id="btnReset" value="reset" title="start over" onClick={() => this.mouseTracker.handleReset(this.refs.canvas)} /></li>
                  <li><input type="button" className="button1" id="btnMakeSnowflake" value="make snowflake!" style={{"fontWeight":"bold", "whiteSpace":"normal"}} title="See your snowflake!" onClick={() => artSupplies.drawSnowflake(this.refs.board, this.refs.canvas, this.offScreenCanvases)}/></li>
                  <li><label title="Creates a folded paper appearance."><input ref="shadingCb" type="checkbox" className="checkbox1" id="cbShading" onChange={(e) => this.changeShading()} checked={true}/>shading on</label></li>
                  <li><label title="Causes the snowflake to be redrawn every time you change the triangle."><input ref="autoUpdateCb" type="checkbox" className="checkbox1" id="cbAutoUpdate" onChange={(e) => this.changeAutoUpdate()} checked={true}/>auto update</label></li>
                </ul>
            </div>
        </div>
      </div>
    );
  }
}

export default SnowflakeCanvas;
