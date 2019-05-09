import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import "semantic-ui-css/semantic.min.css";
import "./index.css";
import Root from "./hoc/Root/Root";
import registerServiceWorker from "./registerServiceWorker";

import rootReducer from "./store/reducers";
import { setUser, clearUser, setWorkspace } from "./store/actions/index";

// Creating a global state. store will return return value from executing createStore()
const store = createStore(rootReducer, composeWithDevTools());

// Sets user data on global state
const RootWithAuth = withRouter(
  connect(
    Root.mapStateFromPros,
    { setUser, clearUser, setWorkspace }
  )(Root)
);

// Provider provide global state to all of our components
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithAuth />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
