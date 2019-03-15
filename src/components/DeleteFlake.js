import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class DeleteFlake extends Component {
  constructor (props) {
    super(props);
    this.state = {
      done: false
    }
    this.width = this.props.width || 440;
    this.height = this.props.height || 440;
    this.snowflakesRef = this.props.firebase.database().ref("snowflakes");
  }

  componentDidMount () {
    this.snowflakesRef.child(this.props.location.state.currentSnowflake).once('value')
    .then((snapshot) => {
      var img = new Image();
      img.src = snapshot.val().image;
      img.onload = () => {
        this.refs.canvas.getContext('2d').drawImage(img, 0, 0);
      }
    });
  }

  handleDelete () {
    this.snowflakesRef.child(this.props.location.state.currentSnowflake).remove()
    .then(res => {
      console.log(res);
      alert("Deleted snowflake!");
      this.setState({done: true});
    }).catch(e => {
      console.log("Encountered an error, error object on next line");
      console.log(e);
    })
  }

  render () {
    if (this.state.done) {
      return <Redirect to='/browse' />
    }
    return (
      <div style={{textAlign: "center"}}>
        <canvas ref="canvas" width={`${this.width}px`} height={`${this.height}px`}></canvas>
        <div>
          Are you sure you want to delete this snowflake?
        </div>
        <input style={{backgroundColor: "tomato", fontWeight: "bold", margin: "20px", padding: "20px"}} type="button" value="Yes, DELETE!" onClick={() => this.handleDelete()}/>
      </div>
    );
  }
}

export default DeleteFlake;
