import React, { Component } from 'react';

class LogIn extends Component {
  logOut (evt) {
    this.props.firebase.auth().signOut().then((result) => {
      // success! do nothing
    }).catch((e) => {
      console.log("There was an error while trying to log out. Error object on next line:");
      console.log(e);
    });
  }

  logIn (evt) {
    this.props.firebase.auth().signInWithPopup(this.props.provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //   My app doesn't use it for anything.
      this.token = result.credential.accessToken;
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
    return (
      this.props.user ? this.getLogOutButton() : this.getLogInButton()
    );
  }
}

export default LogIn;
