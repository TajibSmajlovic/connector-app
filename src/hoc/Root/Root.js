import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Loader } from "semantic-ui-react";

import firebase from "../../database/firebase";
import AsyncComponent from "../../hoc/AsyncComponent/AsyncComponent";

const AsyncWorkspace = AsyncComponent(() => {
  return import("../../containers/Workspace/Workspace");
});
const AsyncRegister = AsyncComponent(() => {
  return import("../../containers/Authentication/Register/Register");
});
const AsyncLogin = AsyncComponent(() => {
  return import("../../containers/Authentication/Login/Login");
});
const AsyncConnector = AsyncComponent(() => {
  return import("../../containers/Connector/Connector");
});
const AsyncBackdrop = AsyncComponent(() => {
  return import("../../components/UI/Backdrop/Backdrop");
});

// Makes roots to 3 main parts of the app: Register, Login and dashboard of the app.
class Root extends Component {
  // When user is logged in path is changed to '/' which is apps dashboard.
  componentDidMount() {
    console.log(this.props);
    firebase.auth().onAuthStateChanged(user => {
      if (this.props.workspace.workspace || user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        firebase.auth().signOut();
        this.props.history.replace("/workspace");
        this.props.clearUser();
      }
    });
  }

  static mapStateFromPros = state => ({
    isLoading: state.user.isLoading,
    workspace: state.workspace
  });

  render() {
    return this.props.isLoading ? (
      <AsyncBackdrop show={this.props.isLoading}>
        <Loader active={this.props.isLoading} size="huge">
          <p>Preparing Connector...</p>
        </Loader>
      </AsyncBackdrop>
    ) : (
      <Switch>
        <Route path="/" exact component={AsyncConnector} />
        <Route path="/register" component={AsyncRegister} />
        <Route path="/login" component={AsyncLogin} />
        <Route path="/workspace" component={AsyncWorkspace} />
      </Switch>
    );
  }
}

export default Root;
