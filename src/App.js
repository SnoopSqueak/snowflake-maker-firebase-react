import React, { Component } from 'react';
import './App.css';
import SnowflakeMaker from './components/SnowflakeMaker/SnowflakeMaker';
import * as firebase from 'firebase';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Landing from './components/Landing';
import LogIn from './components/LogIn';
import SnowflakeBrowser from './components/SnowflakeBrowser';
import DeleteFlake from './components/DeleteFlake';
import config from './secretConfig';

// Initialize Firebase
firebase.initializeApp(config);

class App extends Component {
  constructor (props) {
    super(props);
    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(this.handleAuthChange.bind(this));
  }

  handleAuthChange () {
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <nav className="navbar">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/make">Make a Snowflake</Link>
                </li>
                <li>
                  <Link to="/browse">Browse Snowflakes</Link>
                </li>
                <li>
                  <LogIn firebase={firebase} provider={this.provider} user={firebase.auth().currentUser}/>
                </li>
              </ul>
            </nav>
            <div id="contents">
              <Route path="/" exact component={Landing}/>
              <Route path="/make" render={props => (
                  <SnowflakeMaker {...props} firebase={firebase} provider={this.provider}/>
              )}/>
              <Route path="/browse" render={props => (
                  <SnowflakeBrowser {...props} firebase={firebase}/>
              )}/>
              <Route path="/delete" render={props => (
                  <DeleteFlake {...props} firebase={firebase}/>
              )}/>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
