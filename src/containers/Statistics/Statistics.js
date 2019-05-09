import React, { Component } from "react";
import { Grid } from "semantic-ui-react";

import firebase from "../../database/firebase";
import styles from "./Statistics.module.css";
import Loader from "../../components/UI/Loader/Loader";
import { connect } from "react-redux";

class Statistic extends Component {
  state = {
    totalUsers: null,
    totalOnlineUsers: null,
    totalRooms: null,
    loading: true,
    usersDatabase: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/users`),
    onlineUsersDatabase: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/presence`),
    roomsDatabase: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/rooms`)
  };

  // Connects to database and calculate how many registered users are there in database.
  componentDidMount() {
    this.userStatistic();
    this.activeUserStatistic();
    this.roomsStatistic();
  }

  userStatistic() {
    this.state.usersDatabase.on("value", user => {
      this.setState({ totalUsers: user.numChildren(), loading: false });
    });
  }

  activeUserStatistic() {
    this.state.onlineUsersDatabase.on("value", user => {
      this.setState({ totalOnlineUsers: user.numChildren(), loading: false });
    });
  }

  roomsStatistic() {
    this.state.roomsDatabase.on("value", room => {
      this.setState({
        totalRooms: room.numChildren(),
        loading: false
      });
    });
  }

  render() {
    let activeUsers = (
      <div>
        <Loader />
        <p>fetching data</p>
      </div>
    );
    if (!this.state.loading) {
      activeUsers = (
        <div>
          <h1>{this.state.totalOnlineUsers}</h1>
          <p>online users</p>
        </div>
      );
    }

    let totalRooms = (
      <div>
        <Loader />
        <p>fetching data</p>
      </div>
    );
    if (!this.state.loading) {
      totalRooms = (
        <div>
          <h1>{this.state.totalRooms}</h1>
          <p>total rooms</p>
        </div>
      );
    }

    let totalUsers = (
      <div>
        <Loader />
        <p>fetching data</p>
      </div>
    );
    if (!this.state.loading) {
      totalUsers = (
        <div>
          <h1>{this.state.totalUsers}</h1>
          <p>total users</p>
        </div>
      );
    }
    return (
      <Grid textAlign="center" className={styles.Grid}>
        <Grid.Row columns={7}>
          <Grid.Column>{activeUsers}</Grid.Column>
          <Grid.Column>{totalRooms}</Grid.Column>
          <Grid.Column>{totalUsers}</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  workspace: state.workspace
});

export default connect(mapStateToProps)(Statistic);
