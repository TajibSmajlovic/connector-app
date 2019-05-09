import React, { Component } from "react";
import { connect } from "react-redux";

import SocialMedia from "../../../components/UI/SocialMedia/SocialMedia";
import { auth, provider } from "../../../database/firebase";
import firebase from "../../../database/firebase";

class SocialMediaAuthentication extends Component {
  state = {
    user: null,
    usersDB: firebase.database().ref(`${this.props.workspace.workspace}/users`)
  };

  // It allows to register / login with facebook account
  facebookLogin = () => {
    auth()
      .signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user });
        return this.state.usersDB.child(user.uid).set({
          name: user.displayName,
          avatar: user.photoURL
        });
      });
  };

  /*  logout = () => {
    auth()
      .signOut()
      .then(() => {
        this.setState({ user: null });
      });
  };*/

  render() {
    return (
      <SocialMedia facebook={this.facebookLogin}>
        {this.props.children}
      </SocialMedia>
    );
  }
}

const mapStateToProps = state => ({
  workspace: state.workspace
});

export default connect(mapStateToProps)(SocialMediaAuthentication);
