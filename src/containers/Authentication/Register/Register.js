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
import { connect } from "react-redux";
import firebase from "../../../database/firebase";
import md5 from "md5"; //H Hash messages

import styles from "./Register.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary"; // Servers as wrapper
import Logo from "../../../components/UI/Logo/Logo";
import Input from "../../../components/Form/Input/Input";
import Statistics from "../../Statistics/Statistics";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import BackdropErrorMessage from "../../../components/UI/Backdrop/BackdropErrorMessage/BackdropErrorMessage";
import SocialMediaAuthentication from "../SocialMediaAuthentication/SocialMediaAuthentication";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmed: "",
    loading: false,
    backdropError: false,
    errors: [],
    usersDB: firebase.database().ref(`${this.props.workspace.workspace}/users`)
  };

  // Taking the input from forms
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Checks if form is valid. If it is not it pushes error message into an errors array. If it is valid, it continues
  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields!" };
      this.setState({
        errors: errors.concat(error),
        backdropError: true
      });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid!" };
      this.setState({
        errors: errors.concat(error),
        backdropError: true
      });
      return false;
    } else {
      return true;
    }
  };

  // If lenght of any input is 0 it will be returned false (form is not entirely filled)
  isFormEmpty = ({ username, email, password, passwordConfirmed }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmed.length
    );
  };

  // If password is less than 6 or password doesn't match passwordConfirmed it will return an error
  isPasswordValid = ({ password, passwordConfirmed }) => {
    if (password.length < 6 || passwordConfirmed.length < 6) {
      return false;
    } else if (password !== passwordConfirmed) {
      return false;
    } else {
      return true;
    }
  };

  // If there are error messages stored in errors array, this method will show it on screen
  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  // When there is any kind of error, backdrop will appear. errorHandler() is the function that disables backdrop.
  errorHandler = () => {
    this.setState({ backdropError: false });
  };

  // By clicking 'Register' button this method is executed. Firstly, it will prevent page from refreshing, then it will check isFormValid(). If it is valid then it will remove all errors from our errors array and set the loading to true. It will also create a User and put it in firebase. When a Promise is returned loading will be set to false. If some error happens while creating a User in database, backdrop will show with error message
  regsterSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              });
            })
            .catch(error => {
              console.error(error);
              this.setState({
                errors: this.state.errors.concat(error),
                loading: false
              });
            });
        })
        .catch(error => {
          this.setState({
            errors: this.state.errors.concat(error),
            backdropError: true,
            loading: false
          });
          console.log(error);
        });
    }
  };

  saveUser = createdUser => {
    return this.state.usersDB.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    // destructuring
    const {
      username,
      email,
      password,
      passwordConfirmed,
      errors,
      loading
    } = this.state;

    return (
      <Aux>
        <Backdrop show={this.state.backdropError} clicked={this.errorHandler}>
          <BackdropErrorMessage click={this.errorHandler}>
            {this.displayErrors(errors)}
          </BackdropErrorMessage>
        </Backdrop>

        <Grid textAlign="center" verticalAlign="middle" className={styles.Grid}>
          <Grid.Column style={{ maxWidth: 500 }}>
            <Header as="h1" textAlign="center">
              <Logo />
            </Header>
            <Form size="large" autoComplete="off">
              <Segment stacked className={styles.SegmentColor}>
                <Header as="h2" style={{ color: "white" }}>
                  Welcome to Connector
                </Header>

                <Input
                  name="username"
                  placeholder="Username"
                  icon="user"
                  iconPosition="left"
                  type="text"
                  value={username}
                  clicked={this.inputHandler}
                />
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
                <Input
                  name="passwordConfirmed"
                  placeholder="Password Confirm"
                  icon="repeat"
                  iconPosition="left"
                  type="password"
                  value={passwordConfirmed}
                  clicked={this.inputHandler}
                />

                <Button
                  onClick={this.regsterSubmit}
                  disabled={loading}
                  className={loading ? "loading" : ""}
                  color="vk"
                  fluid
                  size="large"
                >
                  Register
                </Button>
              </Segment>
            </Form>
            <Link to="/login">
              <Button fluid className={styles.Button}>
                Already a &nbsp;
                <Icon name="user circle" size="large" fitted /> &nbsp;?
              </Button>
            </Link>
            <Divider horizontal />
            <SocialMediaAuthentication>
              Register with Social Media
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

export default connect(mapStateToProps)(Register);
