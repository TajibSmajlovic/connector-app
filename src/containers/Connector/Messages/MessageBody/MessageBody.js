import React from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import { geolocated } from "react-geolocated";
import { Picker, emojiIndex } from "emoji-mart";
import uuidv4 from "uuid/v4"; // Creates a random string

import "emoji-mart/css/emoji-mart.css";
import styles from "./MessageBody.module.css";

import firebase from "../../../../database/firebase";
import UploadFileModal from "./UploadFileModal/UploadFileModal";
import ProgressBar from "../../../../components/UI/ProgressBar/ProgressBar";

class MessageBody extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase
      .database()
      .ref(`${this.props.workspace.workspace}/typing`),
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    message: "",
    room: this.props.currentRoom,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
    emoji: false
  };

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
    console.log(this.props.workspace.workspace);
  }

  // Method for opening and closing modal
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  // Taking the input
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleEmojiButton = () => {
    this.setState({ emoji: !this.state.emoji });
  };

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message;

    const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
    this.setState({ message: newMessage, emoji: false });
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  // Converts emoji value to unicode
  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  // Creating a message object
  createMessage = (fileUrl = null) => {
    let message = {
      // User object within the message Object
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      // When this message is created
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    if (fileUrl !== null) {
      message["media"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  // Method for sending message
  sendMessage = () => {
    // Destructuring
    const { getMessageRef } = this.props;
    const { message, room, user, typingRef } = this.state;

    // If there is a message, a message object which is created by createMessage(), will be set in the database with the corresponding reference (workspace/messages/...)
    if (message) {
      this.setState({ loading: true });
      getMessageRef()
        .child(room.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
          typingRef
            .child(room.id)
            .child(user.uid)
            .remove();
        })
        .catch(err => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  // If coords properties are available, it will create location variable and store it within message object
  createLocation = () => {
    let location = "";
    if (this.props.coords) {
      location = `https://www.google.com/maps?q=${this.props.coords.latitude},${
        this.props.coords.longitude
      }`;
    } else {
      location = "Unable to get Location!";
    }

    let message = {
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    message["location"] = location;

    return message;
  };

  // Posting location message in database
  sendLocation = () => {
    // Destructuring
    const { getMessageRef } = this.props;
    const { room } = this.state;

    this.setState({ loading: true });
    getMessageRef()
      .child(room.id)
      .push()
      .set(this.createLocation())
      .then(() => {
        this.setState({ loading: false, message: "", errors: [] });
      })
      .catch(err => {
        this.setState({
          loading: false,
          errors: this.state.errors.concat(err)
        });
      });
  };

  // Setting path for private as well as public messages when uploading files
  getPath = () => {
    if (this.props.privateMessage) {
      return `chat/private/${this.state.room.id}`;
    } else {
      return "chat/public";
    }
  };

  uploadFile = (file, metadata) => {
    const { getMessageRef } = this.props;

    const pathToUpload = this.state.room.id;
    const ref = getMessageRef();
    const filePath = `${this.getPath()}/${uuidv4()}`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        // Listen for any state change
        this.state.uploadTask.on(
          "state_changed",
          state => {
            const percentUploaded = Math.round(
              (state.bytesTransferred / state.totalBytes) * 100
            );
            // Tracks how much of file has been uploaded over time
            this.setState({ percentUploaded });
          },
          error => {
            this.setState({
              errors: this.state.errors.concat(error),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            // Upon completing state change callback, getDownloadURL() method will be executed in uploadTask, and after is executed a promise with downloadUrl will be returned
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                this.sendFileMessage(downloadURL, ref, pathToUpload);
              })
              .catch(error => {
                this.setState({
                  errors: this.state.errors.concat(error),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  // Function arguments are passed in uploadFile() where sendfile() is called to be executed.
  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(error => {
        this.setState({
          errors: this.state.errors.concat(error)
        });
      });
  };

  typingHandler = event => {
    if (event.keyCode === 13) {
      this.sendMessage();
    }

    const { message, typingRef, room, user } = this.state;

    if (message) {
      typingRef
        .child(room.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef
        .child(room.id)
        .child(user.uid)
        .remove();
    }
  };

  render() {
    // Destructuring from state
    const {
      errors,
      message,
      modal,
      uploadState,
      percentUploaded,
      emoji
    } = this.state;

    return (
      <Segment clearing className={styles.SegmentColor}>
        {emoji && (
          <Picker
            style={{ position: "absolute", bottom: 100, left: 10 }}
            onSelect={this.handleAddEmoji}
            set="apple"
            title="Select your emoji"
            emoji="point_up"
          />
        )}

        <Input
          fluid
          size="large"
          autoComplete="off"
          name="message"
          value={message}
          ref={node => (this.messageInputRef = node)}
          label={
            <Button
              icon={emoji ? "close" : "smile"}
              content={emoji ? "close" : null}
              onClick={this.handleEmojiButton}
            />
          }
          labelPosition="left"
          placeholder="Write your message"
          onKeyDown={this.typingHandler}
          error={errors.some(error => error.message.includes("message"))}
          onChange={this.inputHandler}
        />
        <Button.Group icon fluid>
          <Button
            primary
            onClick={this.openModal}
            disabled={uploadState === "uploading"}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
          <Button
            onClick={this.sendLocation}
            secondary
            content="Send location"
            labelPosition="right"
            icon="location arrow"
          />
        </Button.Group>
        <UploadFileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(MessageBody);
