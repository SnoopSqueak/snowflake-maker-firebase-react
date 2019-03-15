import React, { Component } from 'react';
//import './Landing.css';

class LogIn extends Component {
  logOut (evt) {
    this.props.firebase.auth().signOut().then((result) => {
      //this.uid = null;
      //this.token = null;
      //this.props.setUser(null);
      //document.getElementById("logInStatus").innerText = "(Not logged in)";
      //document.getElementById("btnLogIn").addEventListener("click", this.logIn, false);
      //document.getElementById("btnLogIn").removeEventListener("click", this.logOut, false);
      //document.getElementById("btnLogIn").innerText = "Log in with Google"
    }).catch((e) => {
      console.log("There was an error while trying to log out. Error object on next line:");
      console.log(e);
    });
  }

  logIn (evt) {
    this.props.firebase.auth().signInWithPopup(this.props.provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      this.token = result.credential.accessToken;
      // The signed-in user info.
      //this.user = result.user;
      //this.uid = result.user.uid;
      //console.log(result.user);
      //this.props.setUser(result.user);
      //document.getElementById("logInStatus").innerText = "(Logged in as: " + this.props.firebase.auth().currentUser.displayName + ")";
      //document.getElementById("btnLogIn").removeEventListener("click", this.logIn, false);
      //document.getElementById("btnLogIn").addEventListener("click", this.logOut, false);
      //document.getElementById("btnLogIn").innerText = "Log out"
      // ...
    }).catch((error) => {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // The email of the user's account used.
      // var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // ...
      console.log("There was an error while trying to log in. Here's the message: " + error.message);
    });
  }

  getLogInButton () {
    return (
      <button id="btnLogIn" className="save" onClick={(e) => this.logIn(e)}>Log in with Google</button>
    );
  }

  getLogOutButton () {
    return (
      <button id="btnLogIn" className="save" onClick={(e) => this.logOut(e)}>Log out as {this.props.user.displayName}</button>
    );
  }

  render () {
    //console.log(this.props.firebase.auth().currentUser);
    return (
      this.props.user ? this.getLogOutButton() : this.getLogInButton()
    );
  }
}

export default LogIn;

//<div id="logInStatus" style={{color: "black", textAlign: "center"}}>(Not logged in)</div>
