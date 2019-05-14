import { combineReducers } from "redux"; // Combine multiple reducers

import * as actionType from "../actions/actionTypes";

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const initialWorkspaceState = {
  workspace: false
};

const workspaceReducer = (state = initialWorkspaceState, action) => {
  switch (action.type) {
    case actionType.SET_WORKSPACE:
      return {
        workspace: action.payload.workspace
      };
    default:
      return state;
  }
};

// Reduce all the user related data
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionType.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionType.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
};

// Sets initial current room to null
const initialRoomState = {
  currentRoom: null,
  isPrivateMessage: false,
  userPosts: null
};

const roomReducer = (state = initialRoomState, action) => {
  switch (action.type) {
    case actionType.SET_CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.payload.currentRoom
      };
    case actionType.SET_PRIVATE_MESSAGE:
      return {
        ...state,
        isPrivateMessage: action.payload.isPrivateMessage
      };
    case actionType.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  room: roomReducer,
  workspace: workspaceReducer
});

export default rootReducer;
