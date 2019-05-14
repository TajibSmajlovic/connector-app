import * as actionType from "./actionTypes";

// Accepts room data and returns and object with type and payload
export const setCurrentRoom = room => {
  return {
    type: actionType.SET_CURRENT_ROOM,
    payload: {
      currentRoom: room
    }
  };
};

export const setPrivateMessage = isPrivateMessage => {
  return {
    type: actionType.SET_PRIVATE_MESSAGE,
    payload: { isPrivateMessage }
  };
};

export const setUserPosts = userPosts => {
  return {
    type: actionType.SET_USER_POSTS,
    payload: {
      userPosts
    }
  };
};
