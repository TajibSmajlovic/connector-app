import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Grid, Icon, Image, Input, Modal } from "semantic-ui-react";

import firebase from "../../../../../database/firebase";
import AvatarEditor from "react-avatar-editor";

class ChangeAvatarModal extends Component {
  state = {
    user: this.props.currentUser,
    previewImage: "",
    croppedImage: "",
    blob: "",
    uploadedCroppedImage: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase
      .database()
      .ref(this.props.workspace.workspace + "/users"),
    metadata: {
      contentType: "image/jpeg"
    }
  };

  // Handling new avatar image
  handleFileInput = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  // Handling cropped avatar image
  cropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob
        });
      });
    }
  };

  // Method for uploading cropped avatar image and calling changeAvatar() as callback function
  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    storageRef
      .child(`avatars/user/${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadedCroppedImage: downloadURL }, () =>
            this.changeAvatar()
          );
        });
      });
  };

  // Method for changing avatar image in database
  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage
      })
      .then(() => {
        this.props.closeModal();
      })
      .catch(err => {});

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => {})
      .catch(err => {});
  };

  render() {
    const { previewImage, croppedImage } = this.state;
    const { modal } = this.props;

    return (
      <Modal
        basic
        open={modal}
        onClose={this.closeModal}
        style={{ height: "50vh" }}
      >
        <Modal.Header>Change Avatar</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.handleFileInput}
            fluid
            type="file"
            label="New Avatar"
            name="previewImage"
          />
          <Grid centered stackable columns={2}>
            <Grid.Row centered>
              <Grid.Column className="ui center aligned grid">
                {previewImage && (
                  <AvatarEditor
                    ref={node => (this.avatarEditor = node)}
                    image={previewImage}
                    width={120}
                    height={120}
                    border={50}
                    scale={1.2}
                  />
                )}
              </Grid.Column>
              <Grid.Column>
                {croppedImage && (
                  <Image
                    style={{ margin: "3.5em auto" }}
                    width={100}
                    height={100}
                    src={croppedImage}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          {croppedImage && (
            <Button color="green" inverted onClick={this.uploadCroppedImage}>
              <Icon name="save" /> Change Avatar
            </Button>
          )}
          <Button color="green" inverted onClick={this.cropImage}>
            <Icon name="image" /> Preview
          </Button>
          <Button color="red" inverted onClick={this.closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    workspace: state.workspace
  };
};

export default connect(mapStateToProps)(ChangeAvatarModal);
