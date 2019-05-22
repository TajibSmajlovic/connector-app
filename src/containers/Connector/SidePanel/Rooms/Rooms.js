import React, { Component } from "react";
import {
  Menu,
  Icon,
  Modal,
  Button,
  Input,
  Form,
  Segment,
  TextArea,
  Label,
  Image
} from "semantic-ui-react";
import firebase from "../../../../database/firebase";
import { connect } from "react-redux";

import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import {
  setCurrentRoom,
  setPrivateMessage
} from "../../../../store/actions/roomActions";

class Rooms extends Component {
  state = {
    user: this.props.currentUser,
    room: null,
    rooms: [],
    activeRoom: "",
    privateRooms: [],
    roomName: "",
    roomDetails: "",
    roomRef: firebase.database().ref(`${this.props.workspace.workspace}/rooms`),
    messagesRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/messages`),
    typingRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/typing`),
    notifications: [],
    modal: false,
    willingToRelocate: false,
    firstLoad: true
  };

  componentDidMount() {
    this.workspaceRooms();
  }

  // Unmounting all listeners when we are on a different route (ex: '/login')
  componentWillUnmount() {
    // Turning off firebase
    this.state.roomRef.off();

    this.state.rooms.forEach(room => {
      this.state.messagesRef.child(room.id).off();
    });
  }

  workspaceRooms = () => {
    let loadedRooms = [];

    // Push every value ('name')  into the loadedRooms[]
    this.state.roomRef.on("child_added", snap => {
      loadedRooms.push(snap.val());
      this.setState({ rooms: loadedRooms }, () => this.setFirstRoom());
      this.notificationsListener(snap.key);
    });
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  // Add room upon clicking on button
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addRoom();
    }
  };

  // Taking the input
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Form will be valid only if roomName and roomDetails are provided by user(input)
  isFormValid = ({ roomName, roomDetails }) => roomName && roomDetails;

  // Takes first room from rooms[] and sets it as active room
  setFirstRoom = () => {
    const firstRoom = this.state.rooms[0];
    if (this.state.firstLoad && this.state.rooms.length > 0) {
      this.props.setCurrentRoom(firstRoom);
      this.setActiveRoom(firstRoom);
      this.setState({ room: firstRoom });
    }
    this.setState({ firstLoad: false });
  };

  addRoom = () => {
    let { roomRef, roomName, roomDetails, user } = this.state;

    // Gets unique key
    const key = roomRef.push().key;

    const newRoom = {
      id: key,
      name: roomName,
      details: roomDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    // Add room with newRoom properties
    roomRef
      .child(key)
      .update(newRoom)
      .then(() => {
        this.setState({ roomName: "", roomDetails: "" });
        this.closeModal();
        console.log("room added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  // Sets current room
  changeRoom = room => {
    this.setActiveRoom(room);
    this.clearTyping();
    this.clearNotifications();
    this.props.setCurrentRoom(room);
    this.props.setPrivateMessage(false);
    this.setState({ room });
  };

  // Clear typing collection
  clearTyping = () => {
    this.state.typingRef
      .child(this.state.room.id)
      .child(this.state.user.uid)
      .remove();
  };

  // Sets active room
  setActiveRoom = room => {
    this.setState({ activeRoom: room.id });
  };

  // Listening for value (new messages) changes
  notificationsListener = roomId => {
    this.state.messagesRef.child(roomId).on("value", snap => {
      if (this.state.room) {
        this.handleNotifications(
          roomId,
          this.state.room.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (roomId, currentRoomId, notifications, snap) => {
    let lastTotal = 0;

    // Finding indexes of notifications array if notificationID is === roomID
    let index = notifications.findIndex(
      notification => notification.id === roomId
    );

    if (index !== -1) {
      if (roomId !== currentRoomId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: roomId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  // Clearing notifications upon reading them
  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.room.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  // Getting the number of notifications
  getNotificationCount = room => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  // Display rooms
  displayRooms = rooms => {
    if (rooms.length > 0) {
      return rooms.map(room => (
        <Menu.Item
          key={room.id}
          active={room.id === this.state.activeRoom}
          onClick={() => this.changeRoom(room)}
          name={room.name}
          style={{
            opacity: 0.8,
            color: "white",
            fontSize: 16,
            verticalAlign: "baseline"
          }}
        >
          {this.getNotificationCount(room) && (
            <Label style={{ marginTop: "3%" }} color="red">
              {this.getNotificationCount(room)}
            </Label>
          )}
          <Image>
            <Icon name="comments" size="large" />
          </Image>{" "}
          <span>{room.name}</span>
        </Menu.Item>
      ));
    } else {
      return (
        <Menu.Item style={{ fontSize: 15 }}>
          No rooms! Create a new one...
        </Menu.Item>
      );
    }
  };

  render() {
    const { rooms, modal } = this.state;

    return (
      <Aux>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              <Icon name="group" />
              ROOMS ({rooms.length})
            </span>
            <Icon
              name="add"
              link
              style={{
                fontSize: "25px",
                color: "white"
              }}
              onClick={this.openModal}
            />
          </Menu.Item>
          <Menu.Item />
          <div style={{ height: 250, overflow: "auto" }}>
            {this.displayRooms(rooms)}
          </div>
        </Menu.Menu>

        <Modal
          basic
          open={modal}
          onClose={this.closeModal}
          style={{ height: "50%" }}
        >
          <Modal.Header style={{ textDecoration: "underline" }}>
            Add a Room:
          </Modal.Header>
          <Modal.Content style={{ padding: 0 }}>
            <Segment>
              <Form>
                <Form.Field>
                  <Input
                    labelPosition="left corner"
                    label={{ icon: "globe" }}
                    placeholder="Name of the room"
                    name="roomName"
                    onChange={this.handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <TextArea
                    placeholder="Room details"
                    name="roomDetails"
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form>
            </Segment>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  workspace: state.workspace
});

export default connect(
  mapStateToProps,
  { setCurrentRoom, setPrivateMessage }
)(Rooms);
