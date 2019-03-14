import React, { Component } from 'react';
import './Landing.css';

class Landing extends Component {
  render () {
    return (
      <div>
        <div className="landing-info">
          Welcome! This project was hastily created to demonstrate how to use Firebase with React. After logging in with Google, users can create and edit their own snowflakes, and other users (including guest users) can browse snowflakes that other people have created.
        </div>
        <div className="landing-info">
          This project uses an adaptation of the Paper Snowflake Maker by Dan Gries: <a href="http://rectangleworld.com/PaperSnowflake/">http://rectangleworld.com/PaperSnowflake/</a>
        </div>
        <div className="landing-info">
          You can find the source for this project on Git Hub: <a href="https://github.com/SnoopSqueak/snowflake-maker-firebase-react">https://github.com/SnoopSqueak/snowflake-maker-firebase-react</a>
        </div>
        <div className="landing-info">
          Or use the links above to get started!
        </div>
      </div>
    );
  }
}

export default Landing;
