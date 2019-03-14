import React, { Component } from 'react';
import './SnowflakeBrowser.css';
import { Link } from "react-router-dom";

class SnowflakeBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFlakes: [],
      publicFlakes: []
    }
    this.snowflakesRef = this.props.firebase.database().ref('snowflakes');
    this.snowflakeAdded = this.snowflakeAdded.bind(this);
  }

  componentDidMount () {
    this.snowflakesRef.orderByKey().on("child_added", this.snowflakeAdded);
  }

  componentWillUnmount () {
    this.snowflakesRef.orderByKey().off("child_added", this.snowflakeAdded);
  }

  snowflakeAdded (snapshot) {
    this.setState({publicFlakes: [...this.state.publicFlakes, snapshot]})
  }

  mySnowflakes () {
    if (this.props.firebase.auth().currentUser) {
      // query user's snowflakes... if none, show a message; if some, show them.
      return (
        <div>
          <h2>Your Snowflakes</h2>
          <span>This feature is not completed yet.</span>
        </div>
      );
    } else {
      return (
        <span>Please log in to view your snowflakes.</span>
      );
    }
  }

  publicSnowflakes () {
    if (this.state.publicFlakes.length === 0) {
      return (
        <span>Loading snowflakes, or the database is empty...</span>
      );
    } else {
      return (
        <div>
          <h2>Public Snowflakes</h2>
          <h4>(actually all snowflakes until I fix it)</h4>
          {
            this.state.publicFlakes.map((flake, index) => {
              return (
                <Link to={{pathname: "/make", state: {currentSnowflake: flake.key}}} key={index}>
                  <img className="flake-thumb" src={flake.child("image").val()} height="200px" width="200px"/>
                </Link>
              );
            })
          }
        </div>
      );
    }
  }

  render () {
    return (
      <div>
        <div className="browse-container">
          {this.mySnowflakes()}
        </div>
        <div className="browse-container">
          {this.publicSnowflakes()}
        </div>
      </div>
    );
  }
}

export default SnowflakeBrowser;
