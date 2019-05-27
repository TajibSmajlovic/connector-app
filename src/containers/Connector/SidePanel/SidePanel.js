import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

import UserPanel from "./UserPanel/UserPanel";
import Rooms from "./Rooms/Rooms";
import PrivateMessages from "./PrivateMessages/PrivateMessages";
import StarredRooms from "./Rooms/StarredRooms/StarredRooms";

class SidePanel extends Component {
  render() {
    // Reference to the current user on global state
    const { currentUser, workspace } = this.props;

    return (
      <Menu
        inverted
        fixed="right"
        vertical
        style={{
          background: "#152336",
          fontSize: "1,2rem",
          width: "inherit",
          padding: 0,
          height: "100vh"
        }}
      >
        {/*Passing currentUser reference to the UserPanel*/}
        <UserPanel currentUser={currentUser} />
        <hr />
        <StarredRooms currentUser={currentUser} workspace={workspace} />
        <Rooms currentUser={currentUser} />
        <hr />
        <PrivateMessages currentUser={currentUser} workspace={workspace} />
      </Menu>
    );
  }
}

export default SidePanel;
