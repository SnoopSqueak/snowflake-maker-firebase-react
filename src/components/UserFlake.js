import React, { Component } from 'react';
import './UserFlake.css';
import { Link } from "react-router-dom";

class UserFlake extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div id="user-flake" style={{height: `${this.props.height}px`, width: `${this.props.width}px`}}>
        <Link to={{pathname: "/make", state: {currentSnowflake: this.props.flakeKey, copy: true}}}>
          <input type="button" className='trans-button' value="Edit new copy"/>
        </Link>
        <Link to={{pathname: "/make", state: {currentSnowflake: this.props.flakeKey, copy: false}}}>
          <input type="button" className='trans-button' value="Edit in place"/>
        </Link>
        <Link to={{pathname: "/delete", state: {currentSnowflake: this.props.flakeKey}}}>
          <input type="button" className='trans-button' value="Delete"/>
        </Link>
      </div>
    );
  }
}

export default UserFlake;
