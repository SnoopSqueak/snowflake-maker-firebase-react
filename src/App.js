import React, { Component } from 'react';
import './App.css';
import SnowflakeMaker from './components/SnowflakeMaker/SnowflakeMaker';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SnowflakeMaker />
      </div>
    );
  }
}

export default App;
