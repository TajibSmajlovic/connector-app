import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Icon,
  Divider
} from "semantic-ui-react";
import firebase from "../../../database/firebase";

import styles from "./Login.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary"; // Servers as wrapper
import Logo from "../../../components/UI/Logo/Logo";
import Input from "../../../components/Form/Input/Input";
import Statistics from "../../Statistics/Statistics";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import BackdropErrorMessage from "../../../components/UI/Backdrop/BackdropErrorMessage/BackdropErrorMessage";
import SocialMediaAuthentication from "../SocialMediaAuthentication/SocialMediaAuthentication";
import { connect } from "react-redux";

class Login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    backdropError: false,
    errors: [],
    usersDB: firebase.database().ref(`${this.props.workspace.workspace}/users`)
  };

  // Taking the input from forms
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // If there are error messages stored in errors array, this function will show it on screen
  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  // When there is any kind of error, backdrop will appear. errorHandler() is the function that disables backdrop.
  errorHandler = () => {
    this.setState({ backdropError: false });
  };

  // By clicking 'Login' button it will search database and if user is found it will log in into the app. If error occurs, backdrop will appear with the error message
  loginSubmit = event => {
    // Prevent page from reloading
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          if (!(signedInUser.user.uid in this.state.usersDB)) {
            this.state.usersDB
              .child(signedInUser.user.uid)
              .set({
                name: signedInUser.user.displayName,
                avatar: signedInUser.user.photoURL
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            errors: this.state.errors.concat(error),
            loading: false,
            backdropError: true
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  render() {
    // destructuring
    const { email, password, errors, loading } = this.state;

    return (
      <Aux>
        <Backdrop show={this.state.backdropError} clicked={this.errorHandler}>
          <BackdropErrorMessage click={this.errorHandler}>
            {this.displayErrors(errors)}
          </BackdropErrorMessage>
        </Backdrop>

        <Grid textAlign="center" verticalAlign="middle" className={styles.Grid}>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h1" textAlign="center">
              <Logo />
            </Header>
            <Form size="large" autoComplete="off">
              <Segment stacked className={styles.SegmentColor}>
                <Header as="h2" style={{ color: "white" }}>
                  Login to Connector
                </Header>

                <Input
                  name="email"
                  placeholder="e-Mail address"
                  icon="mail"
                  iconPosition="left"
                  type="email"
                  value={email}
                  clicked={this.inputHandler}
                />
                <Input
                  name="password"
                  placeholder="Password"
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  value={password}
                  clicked={this.inputHandler}
                />

                <Button
                  onClick={this.loginSubmit}
                  disabled={loading}
                  className={loading ? "loading" : ""}
                  color="vk"
                  fluid
                  size="large"
                >
                  Login
                </Button>
              </Segment>
            </Form>
            <Link to="/register">
              <Button fluid className={styles.Button}>
                Don't have an &nbsp;
                <Icon name="user circle" size="large" fitted /> &nbsp;?
              </Button>
            </Link>
            <Divider horizontal />
            <SocialMediaAuthentication>
              Login with Social Media
            </SocialMediaAuthentication>
          </Grid.Column>
        </Grid>
        <Statistics />
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  workspace: state.workspace
});

export default connect(mapStateToProps)(Login);
