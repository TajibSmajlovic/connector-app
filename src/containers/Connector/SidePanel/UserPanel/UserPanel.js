import React, { Component } from "react";
import { Grid, Header, Dropdown, Image } from "semantic-ui-react";

import firebase from "../../../../database/firebase";
import ChangeAvatarModal from "./ChangeAvatarModal/ChangeAvatarModal";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser, // Receiving value of current global user and sets that value to dropdown
    modal: false
  };

  componentDidMount() {}

  // Opening and closing modal
  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  // Dropdown options
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.signOut}>Sign Out</span>
    }
  ];

  // Method for signing out
  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  render() {
    const { modal, user } = this.state;

    return (
      <Grid>
        <Grid.Column textAlign="center">
          {/* User Dropdown  */}
          <Header
            style={{ padding: "1em 1em 1.5em 1em" }}
            as="h4"
            inverted
            floated="right"
          >
            <Dropdown
              pointing="top right"
              options={this.dropdownOptions()}
              trigger={
                <span>
                  <Image
                    src={this.state.user.photoURL}
                    spaced="right"
                    avatar
                    style={{ width: "3em", height: "3em" }}
                  />
                  <span style={{ textDecoration: "underline" }}>
                    {this.state.user.displayName}
                  </span>
                </span>
              }
            />
          </Header>
          <ChangeAvatarModal
            modal={modal}
            currentUser={user}
            closeModal={this.closeModal}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
