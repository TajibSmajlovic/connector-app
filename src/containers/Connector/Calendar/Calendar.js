import React, { Component } from "react";
import Calendar from "react-calendar";

class MyApp extends Component {
  state = {
    date: new Date()
  };

  onChange = date => this.setState({ date });

  render() {
    return (
      <div style={{ width: 300, margin: "auto" }}>
        <Calendar onChange={this.onChange} value={this.state.date} />
      </div>
    );
  }
}

export default MyApp;