import React, { Component } from "react";
import { connect } from "react-redux";
import { setUserPosts } from "../../../store/actions/roomActions";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../../database/firebase";

import style from "./Messages.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import MessageHeader from "./MessageHeader/MessageHeader";
import MessageBody from "./MessageBody/MessageBody";
import Message from "../../../components/Message/Mesage";
import TypingAnimation from "./MessageBody/TypingAnimation/TypingAnimation";

class Messages extends Component {
  state = {
    privateMessage: this.props.isPrivateMessage,
    messagesRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/messages`),
    privateMessagesRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/privateMessages`),
    usersRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/starredRooms`),
    typingRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/typing`),
    messages: [],
    messagesLoading: true,
    room: this.props.currentRoom,
    isRoomStarred: false,
    user: this.props.currentUser,
    numberOfUniqueUsers: null,
    search: "",
    searchLoading: false,
    searchResults: [],
    listeners: [],
    typingUsers: []
  };

  componentDidMount() {
    // Destructuring
    const { room, user } = this.state;
    // Checks is there are room and user on global state. If there are messageListener() will execute
    if (room && user) {
      // Listens for new messages added
      this.messageListener(room.id);
      /*     console.log(this.state.usersRef);
      console.log(this.state.messagesRef);
      console.log(this.state.privateMessagesRef);*/
      this.addStarredListener(room.id, user.uid);
      this.addTypingListeners(room.id);
    }

    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentWillMount() {}

  // Every time a new message is sent, it will automatically scroll to bottom
  componentDidUpdate(prevProps, prevState) {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentWillUnmount() {}

  // Loaded messages will be stored first in loadedMessages[], then it will be stored in global state messages[]
  messageListener = roomId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(roomId).on("child_added", message => {
      // Add message value to loaded messages
      loadedMessages.push(message.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    });
  };

  // Getting all room IDs which users have and chencking if one of those IDs are in a /starred
  addStarredListener = (roomID, userID) => {
    this.state.usersRef
      .child(userID)
      .child("starred") //Selects childs up until /starred
      .once("value") // Gets value
      .then(data => {
        if (data.val() !== null) {
          const roomIDs = Object.keys(data.val());
          const prevStarred = roomIDs.includes(roomID);
          this.setState({ isRoomStarred: prevStarred });
        }
      });
  };

  // Function for managing users that are typing
  addTypingListeners = roomId => {
    let typingUsers = [];

    this.state.typingRef.child(roomId).on("child_added", snap => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        this.setState({ typingUsers });
      }
    });

    this.state.typingRef.child(roomId).on("child_removed", snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });
  };

  // Method for how many "active" users are in a room.
  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((accumulator, message) => {
      if (!accumulator.includes(message.user.name)) {
        accumulator.push(message.user.name);
      }
      return accumulator;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numberOfUniqueUsers = `${uniqueUsers.length} user${
      plural ? "s" : ""
    }`;
    this.setState({ numberOfUniqueUsers });
  };

  // For each message display <Message/> component with defined props
  displayMessages = messages => {
    if (messages.length > 0) {
      return messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.state.user}
        />
      ));
    }
  };

  // Display room name.
  displayRoomName = room => {
    if (room && this.state.privateMessage) {
      return `User @${room.name}`;
    } else if (room && !this.state.privateMessage) {
      return `#${room.name}`;
    } else {
      return "";
    }
  };

  // Getting 'ref'
  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateMessage } = this.state;
    if (privateMessage) {
      return privateMessagesRef;
    } else {
      return messagesRef;
    }
  };

  // Tracks every input that is entered and simultaneously runs callback function searchMessages()
  handleSearchInput = event => {
    this.setState(
      {
        search: event.target.value,
        searchLoading: true
      },
      () => this.searchMessages()
    );
  };

  searchMessages = () => {
    const roomMessages = [...this.state.messages]; // Copy all messages in roomMessage
    const regex = new RegExp(this.state.search, "gi"); // regex is assigned both globally and case insensitivy
    const searchResults = roomMessages.reduce((accumulator, message) => {
      if (message.content && message.content.match(regex)) {
        accumulator.push(message);
      }
      return accumulator;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 500);
  };

  // Setting the value for starredRoom and executing callback function starRoom()
  starred = () => {
    this.setState(
      prevState => ({
        isRoomStarred: !prevState.isRoomStarred
      }),
      () => this.starRoom()
    );
  };

  // If room is starred new object within the user's ref will be stored with the following values...
  starRoom = () => {
    if (this.state.isRoomStarred) {
      this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
        [this.state.room.id]: {
          name: this.state.room.name,
          details: this.state.room.details,
          createdBy: {
            name: this.state.room.createdBy.name,
            avatar: this.state.room.createdBy.avatar
          }
        }
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.room.id)
        .remove(error => {
          console.error(error);
        });
    }
  };

  // Calculates how many messages each user has sent in a Room
  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  // Function for displaying animations and name of the user which is typing
  displayTypingUsers = users => {
    if (users.length > 0) {
      return users.map(user => (
        <div
          key={user.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.2em"
          }}
        >
          <span className={style.UserTyping}>{user.name} is typing</span>{" "}
          <TypingAnimation />
        </div>
      ));
    }
  };

  render() {
    // Destructuring
    const {
      messagesRef,
      messages,
      room,
      user,
      numberOfUniqueUsers,
      search,
      searchResults,
      searchLoading,
      privateMessage,
      isRoomStarred,
      typingUsers
    } = this.state;
    const { workspace } = this.props;

    const displayMessages = () => {
      if (search) {
        return this.displayMessages(searchResults);
      } else {
        return this.displayMessages(messages);
      }
    };

    return (
      <Aux>
        <MessageHeader
          roomName={this.displayRoomName(room)}
          numUniqueUsers={numberOfUniqueUsers}
          handleSearchChange={this.handleSearchInput}
          searchLoading={searchLoading}
          privateMessage={privateMessage}
          starred={this.starred}
          isRoomStarred={isRoomStarred}
        />

        <Segment clearing style={{ marginBottom: 0, maxHeight: "90vh" }}>
          <Comment.Group
            style={{ maxWidth: "70vw", maxHeight: "90vh" }}
            className={style.message}
          >
            {displayMessages()}
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messagesEnd = node)} />
          </Comment.Group>
          <MessageBody
            workspace={workspace}
            messagesRef={messagesRef}
            currentRoom={room}
            currentUser={user}
            privateMessage={privateMessage}
            getMessageRef={this.getMessagesRef}
          />
        </Segment>
      </Aux>
    );
  }
}

export default connect(
  null,
  { setUserPosts }
)(Messages);
