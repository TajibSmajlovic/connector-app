import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import styles from "./Connector.module.css";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import InfoPanel from "./InfoPanel/InfoPanel";
import TodoList from "./TodoList/TodoList";
// import Calendar from "./Calendar/Calendar";

const Connector = ({
  currentUser,
  currentRoom,
  isPrivateMessage,
  workspace
}) => (
  <Grid
    columns="equal"
    className={styles.Grid}
    style={{ background: "#eee", width: "100vw" }}
  >
    <Grid.Column style={{ width: "22vw" }} className={styles.Test}>
      <InfoPanel
        privateMessage={isPrivateMessage}
        currentRoom={currentRoom}
        key={currentUser && currentUser.uid}
      />
      <TodoList
        currentRoom={currentRoom}
        key={currentRoom && currentRoom.id}
        workspace={workspace}
        currentUser={currentUser}
      />
    </Grid.Column>

    <Grid.Column style={{ width: "58vw" }} className={styles.Test}>
      <Messages
        workspace={workspace}
        key={currentRoom && currentRoom.id}
        currentRoom={currentRoom}
        currentUser={currentUser}
        isPrivateMessage={isPrivateMessage}
      />
    </Grid.Column>

    <Grid.Column style={{ width: "15vw" }} className={styles.Test}>
      <SidePanel
        workspace={workspace}
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />
    </Grid.Column>
  </Grid>
);

// Return object with the properties we want
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentRoom: state.room.currentRoom,
  isPrivateMessage: state.room.isPrivateMessage,
  workspace: state.workspace
});

export default connect(mapStateToProps)(Connector);
