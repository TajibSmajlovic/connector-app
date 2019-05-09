import React, { Component } from "react";
import {
  Input,
  Menu,
  Segment,
  Grid,
  List,
  Form,
  Checkbox,
  Button
} from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../database/firebase";

import styles from "./Workspace.module.css";
import { setWorkspace } from "../../store/actions/workspaceActions";
import Loader from "../../components/UI/Loader/Loader";

class Workspace extends Component {
  state = {
    workspaces: [],
    workspaceName: "",
    workspacePassword: false,
    activeItem: "PUBLIC",
    checked: false,
    disablePass: true,
    loading: true
  };

  componentDidMount() {
    let loadedWorkspaces = [];
    firebase
      .database()
      .ref()
      .on("child_added", snap => {
        loadedWorkspaces.push(snap.val());

        this.setState({ workspaces: loadedWorkspaces });
      });
  }

  componentWillUnmount() {
    firebase
      .database()
      .ref()
      .off();
  }

  createWorkspace = () => {
    let workspaceName = this.state.workspaceName;
    this.props.setWorkspace(workspaceName);
    this.props.history.replace("/login");

    let workspacePassword = this.state.workspacePassword;

    let workspaceDetails = {
      key: Math.random() * 125616541651651,
      name: workspaceName,
      password: workspacePassword
    };

    firebase
      .database()
      .ref(this.state.workspaceName)
      .update(workspaceDetails)
      .then(() => {
        console.log("Private");
      });
  };

  selectWorkspace = workspace => {
    this.props.setWorkspace(workspace);
    this.props.history.push("/login");
  };

  loginToPrivateWorkspace = (password, name) => {
    if (password === this.state.workspacePassword) {
      this.selectWorkspace(name);
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggle = () => this.setState({ checked: !this.state.checked });

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  displayPublicWorkplaces = workplace => {
    return workplace.map(work => {
      if (work.password === false) {
        return (
          <List animated selection verticalAlign="middle" key={work.key}>
            <List.Item
              className={[styles.Hover, styles.PublicWorkspace].join(" ")}
              onClick={() => this.selectWorkspace(work.name)}
            >
              {" "}
              <span>
                <List.Icon name="globe" />
                {work.name} workspace
              </span>
            </List.Item>
          </List>
        );
      }
    });
  };

  displayPrivateWorkplaces = workplace => {
    return workplace.map(work => {
      if (work.password !== false) {
        return (
          <List animated verticalAlign="middle" key={work.key}>
            <List.Item
              style={{ color: "#1e0425", fontWeight: "bold", fontSize: 30 }}
            >
              <List.Icon name="lock" />
              {work.name} workspace
            </List.Item>
            <List.Item>
              <Input
                focus
                transparent
                size="mini"
                placeholder="Enter Password"
                type="password"
                name="workspacePassword"
                onChange={this.handleChange}
                onClick={this.loginToPrivateWorkspace(work.password, work.name)}
                className={styles.PrivateWorkspaceInput}
              />
            </List.Item>
            <hr />
          </List>
        );
      }
    });
  };

  render() {
    const { activeItem, workspaces } = this.state;

    let privateWorkspace;
    if (this.state.checked) {
      privateWorkspace = (
        <Form.Field>
          <Input
            placeholder="Password"
            type="password"
            name="workspacePassword"
            onChange={this.handleChange}
          />
        </Form.Field>
      );
    }

    let workspace;
    let privateWork = [];
    let publicWork = [];

    workspaces.map(work => {
      if (work.password === false) {
        publicWork.push(work);
      } else {
        privateWork.push(work);
      }
    });

    if (this.state.activeItem === "PUBLIC") {
      if (publicWork.length === 0) {
        workspace = <Loader />;
      } else {
        workspace = this.displayPublicWorkplaces(workspaces);
      }
    } else if (this.state.activeItem === "PRIVATE") {
      if (privateWork.length === 0) {
        workspace = <Loader />;
      } else {
        workspace = this.displayPrivateWorkplaces(workspaces);
      }
    } else {
      workspace = (
        <Segment textAlign="left">
          <Form>
            <Form.Field>
              <Checkbox onChange={this.toggle} label="Private Workspace?" />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder="Name of the workspace"
                name="workspaceName"
                onChange={this.handleChange}
              />
            </Form.Field>

            {privateWorkspace}
            <Button
              color="teal"
              fluid
              size="large"
              onClick={this.createWorkspace}
            >
              CREATE
            </Button>
          </Form>
        </Segment>
      );
    }

    return (
      <Grid columns="two" divided textAlign="center">
        <Grid.Column>
          <Menu attached="top" tabular>
            <Menu.Item
              className={styles.MenuItem}
              name="PUBLIC"
              icon="globe"
              color="grey"
              active={activeItem === "PUBLIC"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              className={styles.MenuItem}
              color="grey"
              name="PRIVATE"
              icon="lock"
              active={activeItem === "PRIVATE"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="CREATE"
              color="grey"
              position="right"
              active={activeItem === "CREATE"}
              onClick={this.handleItemClick}
              className={styles.MenuItem}
            />
          </Menu>

          <Segment className={styles.Background} attached="bottom">
            {workspace}
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  null,
  { setWorkspace }
)(Workspace);
