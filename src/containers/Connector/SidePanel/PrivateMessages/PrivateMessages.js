import React, { Component } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentRoom,
  setPrivateMessage,
  fetchUsers
} from "../../../../store/actions/index";

import firebase from "../../../../database/firebase";

import Aux from "../../../../hoc/Auxiliary/Auxiliary";

class PrivateMessages extends Component {
  state = {
    activePrivateMessage: "",
    user: this.props.currentUser,
    users: [],
    usersRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/users`),
    presenceRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/presence`),
    connectedRef: firebase
      .database()
      .ref(`.info/${this.props.workspace.workspace}/connected`)
  };

  componentDidMount() {
    if (this.state.user) {
      this.privateMessages(this.state.user.uid);
      this.state.presenceRef.child(this.state.user.uid).set(true);
    }
    this.state.presenceRef
      .child(this.state.user.uid)
      .onDisconnect()
      .remove();
  }
  componentWillUnmount() {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.connectedRef.off();

    this.state.presenceRef
      .child(this.state.user.uid)
      .onDisconnect()
      .remove();
  }

  privateMessages = currentUserUid => {
    let loadedUsers = [];
    // All users from database 'ref' will be added to users[]
    this.state.usersRef.on("child_added", user => {
      if (currentUserUid !== user.key) {
        let loadedUser = user.val();
        loadedUser["uid"] = user.key;
        loadedUser["status"] = "offline";
        loadedUsers.push(loadedUser);
      }
    });

    this.props.fetchUsers(loadedUsers);

    /* // Listening in change of value of users and updating '/presence' ref.
    this.state.connectedRef.on("value", user => {
      if (user.val() === true) {
        console.log(user.val());
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
*/
    /*  // Setting status to online when user enters
    this.state.presenceRef.on("child_added", user => {
      if (currentUserUid !== user.key) {
        this.addStatusToUser(user.key);
      }
    });

    // Setting status to offline when user leaves
    this.state.presenceRef.on("child_removed", user => {
      if (currentUserUid !== user.key) {
        this.addStatusToUser(user.key, false);
      }
    });
  };

  // Adding status to users
  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.props.users.reduce((accumulator, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return accumulator.concat(user);
    }, []);*/
    /*
    console.log(updatedUsers);
    this.props.fetchUsers(updatedUsers);*/
  };

  /*isUserOnline = user => user.status === "online";*/

  setActivePrivateMessage = userId => {
    this.setState({ activePrivateMessage: userId });
  };

  // Creates unique string id for privateMessage room
  getRoomId = userId => {
    const currentUserId = this.state.user.uid;
    if (userId < currentUserId) {
      return `${userId}/${currentUserId}`;
    } else {
      return `${currentUserId}/${userId}`;
    }
  };

  privateMessage = user => {
    const roomId = this.getRoomId(user.uid);
    const roomData = {
      id: roomId,
      name: user.name
    };
    this.props.setCurrentRoom(roomData);
    this.props.setPrivateMessage(true);
    this.setActivePrivateMessage(user.uid);
  };

  render() {
    const { users, activePrivateMessage } = this.state;

    console.log(this.props.users);

    let pUsers = this.props.users;

    return (
      <Aux>
        <Menu.Item
          style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}
        >
          {" "}
          <span>
            <Icon name="facebook messenger" /> PRIVATE MESSAGES
          </span>
          ({pUsers.length})
        </Menu.Item>
        <Menu.Menu
          style={{ maxHeight: "30vh", minHeight: "20vh", overflow: "auto" }}
        >
          {this.props.users.map(user => (
            <Menu.Item
              key={user.uid}
              active={user.uid === activePrivateMessage}
              onClick={() => this.privateMessage(user)}
              style={{ fontStyle: "italic", fontSize: 18 }}
            >
              {/*<Icon
                name="circle"
                style={{ marginTop: "3%" }}
                color={this.isUserOnline(user) ? "green" : "red"}
              />*/}
              <Image src={user.avatar} avatar />
              <span>{user.name}</span>
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Aux>
    );
  }
}

const mapStateToProps = state => ({ users: state.users.users });

export default connect(
  mapStateToProps,
  { setCurrentRoom, setPrivateMessage, fetchUsers }
)(PrivateMessages);
