import React, { Component } from 'react';
import './SnowflakeBrowser.css';
import { Link } from "react-router-dom";
import UserFlake from './UserFlake';

class SnowflakeBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snowflakes: []
    }
    this.width = 100;
    this.height = 100;
    this.snowflakesRef = this.props.firebase.database().ref('snowflakes');
    this.snowflakeAdded = this.snowflakeAdded.bind(this);
    this.userFlakeCanvas = document.createElement('canvas');
    this.userFlakeCanvas.width = this.width;
    this.userFlakeCanvas.height = this.height;
    let ctx = this.userFlakeCanvas.getContext('2d');
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.save();
  }

  componentDidMount () {
    this.snowflakesRef.orderByKey().on("child_added", this.snowflakeAdded);
  }

  componentWillUnmount () {
    this.snowflakesRef.orderByKey().off("child_added", this.snowflakeAdded);
  }

  snowflakeAdded (snapshot) {
    this.setState({snowflakes: [...this.state.snowflakes, snapshot]});
  }

  handleMouseEnter (index) {
    this.setState({hoveredFlake: index});
  }

  handleMouseLeave (index) {
    if (this.state.hoveredFlake === index) {
      this.setState({hoveredFlake: null});
    }
  }

  mySnowflakes (flakes) {
    if (!this.props.firebase.auth().currentUser) {
      return (
        <span>Log in to view your snowflakes.</span>
      );
    }
    if (flakes.length > 0) {
      return (
        <div>
          <h2>Your Snowflakes</h2>
          {
            flakes.map((flake, index) => {
              return (
                <div key={index} style={{position: "relative", height: `${this.height}px`, width: `${this.width}px`, display: "inline-block"}} onMouseEnter={() => this.handleMouseEnter(index)} onMouseLeave={() => this.handleMouseLeave(index)}>
                  {this.state.hoveredFlake === index ? <UserFlake width={this.width} height={this.height} flakeKey={flake.key}/> : ""}
                  <img alt="your flake" className="flake-thumb" src={flake.child("image").val()} height={`${this.height/2}px`} width={`${this.width/2}px`} style={{position: "relative", transform: "translate(0, 25px) scale(2, 2)"}}/>
                </div>
              );
            })
          }
        </div>
      );
    } else {
      return (
        <span>You don't have any snowflakes yet.</span>
      );
    }
  }

  publicSnowflakes (flakes) {
    if (flakes.length === 0) {
      return (
        <span>Loading snowflakes, or the database is empty...</span>
      );
    } else {
      return (
        <div>
          <h2>Other Snowflakes</h2>
          <h3>Click a snowflake to make a copy and start editing it</h3>
          {
            flakes.map((flake, index) => {
              return (
                <Link to={{pathname: "/make", state: {currentSnowflake: flake.key}}} key={index}  style={{position: "relative", height: `${this.height}px`, width: `${this.width}px`, display: "inline-block"}}>
                  <img alt="someone's flake" className="flake-thumb" src={flake.child("image").val()} height={`${this.height/2}px`} width={`${this.width/2}px`} style={{position: "relative", transform: "translate(0, 25px) scale(2, 2)"}}/>
                </Link>
              );
            })
          }
        </div>
      );
    }
  }

  render () {
    let userFlakes = [];
    let otherFlakes = [];
    this.state.snowflakes.forEach((flake, index) => {
      if (this.props.firebase.auth().currentUser && flake.child("user").val() === this.props.firebase.auth().currentUser.uid) {
        userFlakes.push(flake);
      } else {
        otherFlakes.push(flake);
      }
    })
    return (
      <div>
        <div className="browse-container">
          {this.mySnowflakes(userFlakes)}
        </div>
        <div className="browse-container">
          {this.publicSnowflakes(otherFlakes)}
        </div>
      </div>
    );
  }
}

export default SnowflakeBrowser;
