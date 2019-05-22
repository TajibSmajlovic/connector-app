import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setCurrentRoom,
  setPrivateMessage
} from "../../../../../store/actions/roomActions";
import { Menu, Icon, Image } from "semantic-ui-react";
import firebase from "../../../../../database/firebase";

class StarredRoom extends Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/starredRooms`),
    activeRoom: "",
    starredRooms: []
  };

  componentDidMount() {
    if (this.state.user) {
      this.displayStarredRoomsListener(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
  }

  // Listening for adding/removing starredRooms
  displayStarredRoomsListener = userID => {
    this.state.usersRef
      .child(userID)
      .child("starred")
      .on("child_added", room => {
        const starredRoom = { id: room.key, ...room.val() };
        this.setState({
          starredRooms: [...this.state.starredRooms, starredRoom]
        });
      });

    this.state.usersRef
      .child(userID)
      .child("starred")
      .on("child_removed", room => {
        const starredRoomRemoved = { id: room.key, ...room.val() };
        const filteredRooms = this.state.starredRooms.filter(room => {
          return room.id !== starredRoomRemoved.id;
        });
        this.setState({ starredRooms: filteredRooms });
      });
  };

  setActiveRoom = room => {
    this.setState({ activeRoom: room.id });
  };

  changeRoom = room => {
    this.setActiveRoom(room);
    this.props.setCurrentRoom(room);
    this.props.setPrivateMessage(false);
  };

  // Displaying starred rooms
  displayStarredRooms = starredRooms =>
    starredRooms.length > 0 &&
    starredRooms.map(room => (
      <Menu.Item
        key={room.id}
        onClick={() => this.changeRoom(room)}
        name={room.name}
        style={{
          opacity: 0.8,
          color: "white",
          fontSize: 16,
          verticalAlign: "baseline"
        }}
        active={room.id === this.state.activeRoom}
      >
        <Image avatar>
          <Icon name="star" color="yellow" size="large" />
        </Image>
        <span>{room.name}</span>
      </Menu.Item>
    ));

  render() {
    const { starredRooms } = this.state;

    return (
      <Menu.Menu style={{ paddingBottom: "2em", textAlign: "center" }}>
        <Menu.Item>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>
            <Icon name="star" /> STARRED ({starredRooms.length})
          </span>{" "}
        </Menu.Item>
        <span style={{ textAlign: "left" }}>
          {this.displayStarredRooms(starredRooms)}{" "}
        </span>
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentRoom, setPrivateMessage }
)(StarredRoom);
