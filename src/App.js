import React, { Component } from 'react';
import './App.css';
import SnowflakeMaker from './components/SnowflakeMaker/SnowflakeMaker';
import * as firebase from 'firebase';

class App extends Component {
  constructor (props) {
    super(props);
    // Initialize Firebase
    let config = {
      apiKey: "AIzaSyDU4Ng4DN6kd_e2lWrf5-tNwhfs8bnD3KM",
      authDomain: "fir-demo-react.firebaseapp.com",
      databaseURL: "https://fir-demo-react.firebaseio.com",
      projectId: "fir-demo-react",
      storageBucket: "fir-demo-react.appspot.com",
      messagingSenderId: "512547763270"
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <div className="App">
        <SnowflakeMaker firebase={firebase} />
      </div>
    );
  }
}

export default App;
