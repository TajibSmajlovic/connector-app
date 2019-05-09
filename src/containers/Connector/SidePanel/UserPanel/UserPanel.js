import React, { Component } from "react";
import { Grid, Header, Dropdown, Image } from "semantic-ui-react";
import { withRouter } from "react-router";

import firebase from "../../../../database/firebase";

class UserPanel extends Component {
  // Receiving value of current global user and sets that value to dropdown
  state = {
    user: this.props.currentUser
  };

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
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.signOut}>Sign Out</span>
    }
  ];

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  render() {
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
        </Grid.Column>
      </Grid>
    );
  }
}

export default withRouter(UserPanel);
