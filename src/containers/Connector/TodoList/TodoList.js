import React, { Component } from "react";
import {
  Segment,
  Header,
  Form,
  Button,
  Input,
  Menu,
  Image
} from "semantic-ui-react";
import firebase from "../../../database/firebase";

class TodoList extends Component {
  state = {
    room: this.props.currentRoom,
    todo: "",
    user: this.props.currentUser,
    todos: []
  };

  componentDidMount() {
    const { room, user } = this.state;

    if (room && user) {
      this.fetchTodos();
    }
  }

  // Taking the input from forms
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addTodo = () => {
    const { todo, user, room } = this.state;

    const ref = firebase
      .database()
      .ref(`${this.props.workspace.workspace}/todos/${room.id}`);
    // Gets unique key
    const key = ref.push().key;

    const newTodo = {
      id: key,
      name: todo,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    // Add room with newRoom properties
    ref
      .child(key)
      .update(newTodo)
      .then(() => {
        this.setState({ todo: "" });
      })
      .catch(err => {
        console.error(err);
      });
  };

  fetchTodos = () => {
    const { room } = this.state;

    const ref = firebase
      .database()
      .ref(`${this.props.workspace.workspace}/todos/${room.id}`);

    ref.on("child_added", snap => {
      const todos = { id: snap.key, ...snap.val() };
      this.setState({
        todos: [...this.state.todos, todos]
      });
    });

    ref.on("child_removed", snap => {
      const todoRemoved = { id: snap.key, ...snap.val() };
      const filteredTodo = this.state.todos.filter(todo => {
        return todo.id !== todoRemoved.id;
      });
      this.setState({ todos: filteredTodo });
    });
  };

  removeTodo = todoId => {
    const { room } = this.state;
    const ref = firebase
      .database()
      .ref(`${this.props.workspace.workspace}/todos/${room.id}`);

    ref.child(todoId).remove(error => {
      console.error(error);
    });
  };

  displayTodos = todos => {
    if (todos.length > 0) {
      return todos.map(todo => (
        <Menu.Item
          key={todo.id}
          name={todo.name}
          style={{ margin: 10, maxHeight: 100 }}
        >
          <Image avatar src={todo.createdBy.avatar} />{" "}
          <span style={{ wordWrap: "break-word", width: "70%" }}>
            {todo.name}
          </span>
          <Button
            floated="right"
            icon="trash"
            size="tiny"
            onClick={() => this.removeTodo(todo.id)}
          />
        </Menu.Item>
      ));
    } else {
      return (
        <Menu.Item style={{ fontWeight: "bold", textAlign: "center" }}>
          No Todos! Create a new one...
        </Menu.Item>
      );
    }
  };

  render() {
    const { todo, todos } = this.state;

    return (
      <Segment style={{ maxHeight: "33vh", overflowY: "auto" }}>
        <Header
          as="h2"
          style={{ textAlign: "center", textDecoration: "underline" }}
        >
          TODOs:
        </Header>
        <Form>
          <Form.Field>
            <Input
              name="todo"
              value={todo}
              placeholder="Write ToDo"
              labelPosition="right"
              maxLength="30"
              autoComplete="off"
              label={<Button onClick={this.addTodo} icon="edit" />}
              onChange={this.inputHandler}
            />
          </Form.Field>
          <hr />
          {this.displayTodos(todos)}
        </Form>
      </Segment>
    );
  }
}

export default TodoList;
